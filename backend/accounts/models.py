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


class ApplicationStatus(models.TextChoices):
    PENDING = "pending", _("Pending Verification")
    UNDER_REVIEW = "under_review", _("Under Review")
    APPROVED = "approved", _("Approved")
    REJECTED = "rejected", _("Rejected")


class OnboardingApplication(models.Model):
    """
    Persisted customer journey onboarding application with KYC verification data,
    audit records, and structured product answers.
    """
    reference_code = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
        help_text=_("Unique customer application tracking reference (e.g. FCA-482910)"),
    )
    service = models.CharField(
        max_length=64,
        db_index=True,
        help_text=_("Service identifier e.g. bank-fca, ins-motor, prop-stand"),
    )
    first_name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    national_id = models.CharField(
        max_length=64,
        db_index=True,
        help_text=_("Zimbabwe National ID or Passport Number"),
    )
    date_of_birth = models.CharField(max_length=32)
    phone = models.CharField(max_length=40)
    email = models.EmailField(db_index=True)
    address = models.TextField()
    answers = models.JSONField(
        default=dict,
        blank=True,
        help_text=_("Structured multi-step form answers submitted by user."),
    )
    status = models.CharField(
        max_length=30,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.PENDING,
        db_index=True,
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default="")
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="onboarding_applications",
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Onboarding Application")
        verbose_name_plural = _("Onboarding Applications")
        indexes = [
            models.Index(fields=["service", "status"]),
            models.Index(fields=["national_id", "email"]),
        ]

    def __str__(self):
        return f"[{self.reference_code}] {self.service} - {self.first_name} {self.surname} ({self.status})"
