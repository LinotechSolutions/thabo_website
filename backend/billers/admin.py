from django.contrib import admin
from billers.models import Biller


@admin.register(Biller)
class BillerAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category", "icon_name", "is_active", "order")
    list_filter = ("category", "is_active")
    search_fields = ("name", "id")
