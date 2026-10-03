from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserRole(models.TextChoices):
    PERSONAL = "personal", _("Personal Banking")
    BUSINESS = "business", _("Business & SME")
    CORPORATE = "corporate", _("Corporate & Institutional")
    DIASPORA = "diaspora", _("Diaspora Banking")
    SELF_SERVICE = "self_service", _("Self-Service Digital Hub")
    STAFF = "staff", _("CBZ Internal Staff")


class User(AbstractUser):
    """
    Custom CBZ User model with portal role separation and strict audit fields.
    """
    email = models.EmailField(_("email address"), unique=True)
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.PERSONAL,
        help_text=_("Designates the portal access and permission scope for this user."),
    )
    phone_number = models.CharField(
        max_length=32,
        blank=True,
        null=True,
        help_text=_("E.164 formatted phone number e.g. +263771234567"),
    )
    national_id = models.CharField(
        max_length=64,
        blank=True,
        null=True,
        help_text=_("National ID or Passport number"),
    )
    country_code = models.CharField(
        max_length=4,
        default="zw",
        help_text=_("Default country code (e.g. zw, zm, ke, tz)"),
    )
    preferred_language = models.CharField(
        max_length=10,
        default="en",
        choices=[
            ("en", "English"),
            ("sn", "Shona"),
            ("nd", "Ndebele"),
            ("sw", "Swahili"),
        ],
    )
    is_verified = models.BooleanField(
        default=False,
        help_text=_("Whether identity KYC verification has succeeded."),
    )

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")
        ordering = ["-date_joined"]

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
