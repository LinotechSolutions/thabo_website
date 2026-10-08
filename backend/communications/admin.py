from django.contrib import admin
from .models import Announcement, ContactChannel, CorporateFact


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "date_display",
        "circular_ref",
        "is_urgent",
        "is_active",
        "order",
    )
    list_filter = ("category", "is_urgent", "is_active")
    search_fields = ("title", "summary", "circular_ref", "tag")
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ("is_urgent", "is_active", "order")
    ordering = ("order", "-created_at")


@admin.register(ContactChannel)
class ContactChannelAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "value",
        "action_text",
        "badge",
        "availability",
        "is_active",
        "order",
    )
    list_filter = ("is_active",)
    search_fields = ("name", "value", "description")
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("is_active", "order")
    ordering = ("order", "name")


@admin.register(CorporateFact)
class CorporateFactAdmin(admin.ModelAdmin):
    list_display = ("label", "key", "value", "confirmed", "order")
    list_editable = ("value", "confirmed", "order")
    search_fields = ("label", "key", "value", "note")
    ordering = ("order", "key")
