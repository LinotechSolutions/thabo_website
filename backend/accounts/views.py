import datetime
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import OnboardingApplication, User
from accounts.serializers import (
    LoginSerializer,
    OnboardingSerializer,
    RegisterSerializer,
    UserSerializer,
)
from audit.services import get_client_ip, record_audit_event
from core.throttling import AuthRateThrottle


def set_auth_cookies(response: Response, access_token: str, refresh_token: str = None):
    """Sets secure, HttpOnly cookies for JWT tokens according to settings."""
    secure = getattr(settings, "SESSION_COOKIE_SECURE", False)
    samesite = getattr(settings, "AUTH_COOKIE_SAMESITE", "Lax")
    access_cookie_name = getattr(settings, "JWT_AUTH_COOKIE", "access_token")
    refresh_cookie_name = getattr(settings, "JWT_AUTH_REFRESH_COOKIE", "refresh_token")
    
    access_lifetime = getattr(settings, "SIMPLE_JWT", {}).get(
        "ACCESS_TOKEN_LIFETIME", datetime.timedelta(minutes=5)
    )
    refresh_lifetime = getattr(settings, "SIMPLE_JWT", {}).get(
        "REFRESH_TOKEN_LIFETIME", datetime.timedelta(days=1)
    )

    response.set_cookie(
        key=access_cookie_name,
        value=str(access_token),
        max_age=int(access_lifetime.total_seconds()),
        httponly=True,
        secure=secure,
        samesite=samesite,
        path="/",
    )

    if refresh_token:
        response.set_cookie(
            key=refresh_cookie_name,
            value=str(refresh_token),
            max_age=int(refresh_lifetime.total_seconds()),
            httponly=True,
            secure=secure,
            samesite=samesite,
            path="/",
        )


def clear_auth_cookies(response: Response):
    """Clears authentication cookies on logout."""
    access_cookie_name = getattr(settings, "JWT_AUTH_COOKIE", "access_token")
    refresh_cookie_name = getattr(settings, "JWT_AUTH_REFRESH_COOKIE", "refresh_token")
    samesite = getattr(settings, "AUTH_COOKIE_SAMESITE", "Lax")

    response.delete_cookie(access_cookie_name, path="/", samesite=samesite)
    response.delete_cookie(refresh_cookie_name, path="/", samesite=samesite)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            record_audit_event(
                request=request,
                action="auth_register_failed",
                status="failure",
                username=request.data.get("username"),
                details={"errors": serializer.errors},
            )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        record_audit_event(
            request=request,
            action="auth_register_success",
            status="success",
            user=user,
            details={"role": user.role, "country": user.country_code},
        )

        response = Response(
            {
                "message": "Registration successful",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )
        set_auth_cookies(response, str(access), str(refresh))
        return response


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            username_attempt = request.data.get("username", "")
            record_audit_event(
                request=request,
                action="auth_login_failed",
                status="failure",
                username=username_attempt,
                details={"portal": request.data.get("portal_type", "")},
            )
            return Response(
                {"detail": "Invalid credentials provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        record_audit_event(
            request=request,
            action="auth_login_success",
            status="success",
            user=user,
            details={"portal": request.data.get("portal_type", ""), "role": user.role},
        )

        response = Response(
            {
                "message": "Login successful",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )
        # Set tokens exclusively in secure HttpOnly cookies (not in JSON body)
        set_auth_cookies(response, str(access), str(refresh))
        return response


class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        refresh_cookie_name = getattr(settings, "JWT_AUTH_REFRESH_COOKIE", "refresh_token")
        refresh_token = request.COOKIES.get(refresh_cookie_name) or request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token was not provided in cookie or payload."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            old_refresh = RefreshToken(refresh_token)
            user_id = old_refresh.payload.get("user_id")
            user = User.objects.get(id=user_id) if user_id else None

            # Token rotation: create new access and optionally new refresh
            new_access = str(old_refresh.access_token)
            
            new_refresh = None
            if getattr(settings, "SIMPLE_JWT", {}).get("ROTATE_REFRESH_TOKENS", True) and user:
                old_refresh.blacklist()
                new_refresh = RefreshToken.for_user(user)

            response = Response(
                {"detail": "Token refreshed successfully."},
                status=status.HTTP_200_OK,
            )
            set_auth_cookies(response, new_access, str(new_refresh) if new_refresh else None)

            record_audit_event(
                request=request,
                action="auth_token_refresh",
                status="success",
            )
            return response

        except (InvalidToken, TokenError) as exc:
            record_audit_event(
                request=request,
                action="auth_token_refresh_failed",
                status="failure",
                details={"error": str(exc)},
            )
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_cookie_name = getattr(settings, "JWT_AUTH_REFRESH_COOKIE", "refresh_token")
        refresh_token = request.COOKIES.get(refresh_cookie_name) or request.data.get("refresh")

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except (InvalidToken, TokenError):
                pass  # Ignore invalid token during logout

        record_audit_event(
            request=request,
            action="auth_logout",
            status="success",
            user=request.user if request.user.is_authenticated else None,
        )

        response = Response(
            {"detail": "Logged out successfully."},
            status=status.HTTP_200_OK,
        )
        clear_auth_cookies(response)
        return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OnboardView(APIView):
    """
    POST /api/accounts/onboard/
    Securely commits customer journey onboarding submissions into PostgreSQL,
    performs National ID and identity validation, captures client IP/User Agent,
    and writes an immutable security audit event.
    """
    permission_classes = [AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = OnboardingSerializer(data=request.data)
        if not serializer.is_valid():
            record_audit_event(
                request=request,
                action="customer_onboarding_failed",
                status="failure",
                details={
                    "errors": serializer.errors,
                    "service": request.data.get("service"),
                },
            )
            return Response(
                {"detail": "Validation error", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client_ip = get_client_ip(request)
        user_agent = request.META.get("HTTP_USER_AGENT", "")[:500]
        authenticated_user = request.user if request.user.is_authenticated else None

        application = serializer.save(
            ip_address=client_ip,
            user_agent=user_agent,
            user=authenticated_user,
        )

        record_audit_event(
            request=request,
            action="customer_onboarding_submitted",
            status="success",
            user=authenticated_user,
            details={
                "ref": application.reference_code,
                "service": application.service,
                "email": application.email,
            },
        )

        return Response(
            {
                "status": "success",
                "reference_code": application.reference_code,
                "service": application.service,
                "message": "Your onboarding application has been securely received and recorded.",
                "created_at": application.created_at,
            },
            status=status.HTTP_201_CREATED,
        )

