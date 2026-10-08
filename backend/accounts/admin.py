from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from accounts.models import OnboardingApplication, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "username",
        "email",
        "role",
        "first_name",
        "last_name",
        "is_staff",
        "is_verified",
        "country_code",
    )
    list_filter = ("role", "is_staff", "is_superuser", "is_active", "country_code")
    search_fields = ("username", "email", "first_name", "last_name", "national_id")
    ordering = ("-date_joined",)

    fieldsets = UserAdmin.fieldsets + (
        (
            "CBZ Custom Profile",
            {
                "fields": (
                    "role",
                    "phone_number",
                    "national_id",
                    "country_code",
                    "preferred_language",
                    "is_verified",
                )
            },
        ),
    )


@admin.register(OnboardingApplication)
class OnboardingApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "reference_code",
        "service",
        "first_name",
        "surname",
        "national_id",
        "email",
        "phone",
        "status",
        "created_at",
    )
    list_filter = ("status", "service", "created_at")
    search_fields = (
        "reference_code",
        "first_name",
        "surname",
        "national_id",
        "email",
        "phone",
    )
    readonly_fields = ("reference_code", "ip_address", "user_agent", "created_at", "updated_at")
    list_editable = ("status",)
    ordering = ("-created_at",)

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "CBZ Custom Profile",
            {
                "fields": (
                    "role",
                    "email",
                    "phone_number",
                    "national_id",
                    "country_code",
                    "preferred_language",
                )
            },
        ),
    )
