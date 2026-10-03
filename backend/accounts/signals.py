from django.contrib.auth.signals import user_logged_in, user_login_failed
from django.dispatch import receiver
from audit.services import record_audit_event


@receiver(user_logged_in)
def on_user_logged_in(sender, request, user, **kwargs):
    record_audit_event(
        request=request,
        action="django_user_logged_in",
        status="success",
        user=user,
    )


@receiver(user_login_failed)
def on_user_login_failed(sender, credentials, request, **kwargs):
    username = credentials.get("username", "") if credentials else ""
    record_audit_event(
        request=request,
        action="django_user_login_failed",
        status="failure",
        username=username,
    )
