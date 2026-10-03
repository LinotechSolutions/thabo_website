from django.contrib import admin
from branches.models import Branch


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ("name", "branch_type", "city", "phone", "is_active")
    list_filter = ("branch_type", "city", "is_active")
    search_fields = ("name", "city", "address")
