from django.conf import settings
from rest_framework import exceptions
from rest_framework.authentication import CSRFCheck
from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    """
    Extends SimpleJWT to read the JWT access token from an HttpOnly cookie.
    Enforces Django CSRF validation on all cookie-authenticated state-changing requests,
    protecting against cross-site request forgery attacks.
    """

    def authenticate(self, request):
        cookie_name = getattr(settings, "JWT_AUTH_COOKIE", "access_token")
        raw_token = request.COOKIES.get(cookie_name)

        if raw_token:
            validated_token = self.get_validated_token(raw_token)
            # Enforce CSRF protection for cookie-authenticated requests
            self.enforce_csrf(request)
            return self.get_user(validated_token), validated_token

        return super().authenticate(request)

    def enforce_csrf(self, request):
        """
        Enforce CSRF validation for state-changing HTTP methods
        when using cookie-based authentication.
        """
        check = CSRFCheck(request)
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied(f"CSRF Failed: {reason}")
