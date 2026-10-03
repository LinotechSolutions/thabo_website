from django.db import connection
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([AllowAny])
@throttle_classes([])
def health_check(request):
    """
    Health check endpoint returning 200 if server and database are healthy.
    GET /api/health/
    """
    db_status = "ok"
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except Exception as exc:
        db_status = f"unhealthy: {str(exc)}"

    is_healthy = db_status == "ok"
    data = {
        "status": "healthy" if is_healthy else "degraded",
        "service": "CBZ Holdings Backend API",
        "version": "1.0.0",
        "database": db_status,
    }
    status_code = status.HTTP_200_OK if is_healthy else status.HTTP_503_SERVICE_UNAVAILABLE
    return Response(data, status=status_code)


@api_view(["GET"])
@permission_classes([AllowAny])
def csrf_token_view(request):
    """
    Exposes CSRF token to frontend and ensures csrftoken cookie is set.
    GET /api/csrf/
    """
    token = get_token(request)
    return Response({"csrfToken": token})
