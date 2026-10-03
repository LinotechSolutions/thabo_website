import logging
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Fail-secure exception handler.
    DRF exceptions (validation errors, 404, 403, 401) preserve appropriate response structures.
    Unexpected 500 errors log full context server-side and return generic, non-leaking messages.
    """
    response = exception_handler(exc, context)

    view_name = None
    if context and "view" in context:
        view_name = context["view"].__class__.__name__

    if response is not None:
        # Standard DRF exception
        if response.status_code >= 500:
            logger.error(
                "Internal server error in view %s: %s",
                view_name,
                str(exc),
                exc_info=True,
            )
            if not getattr(settings, "DEBUG", False):
                response.data = {
                    "detail": "A server error occurred. Please contact support if the issue persists.",
                    "code": "internal_error",
                }
        return response

    # Unhandled Python exception (not caught by DRF)
    logger.exception("Unhandled exception in view %s: %s", view_name, str(exc))

    if getattr(settings, "DEBUG", False):
        return Response(
            {"detail": str(exc), "code": "unhandled_debug_exception"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(
        {
            "detail": "An unexpected error occurred. Please try again later.",
            "code": "server_error",
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
