from django.contrib import admin
from audit.models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("created_at", "action", "status", "username", "ip_address")
    list_filter = ("action", "status", "created_at")
    search_fields = ("username", "ip_address", "action")
    readonly_fields = (
        "user",
        "username",
        "action",
        "ip_address",
        "user_agent",
        "status",
        "details",
        "created_at",
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        # Audit records are immutable
        return False
