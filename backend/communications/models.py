from django.db import models


class AnnouncementCategory(models.TextChoices):
    SHAREHOLDER = "shareholder", "Shareholder Notice"
    CUSTOMER = "customer", "Customer Notice"
    REGULATORY = "regulatory", "Regulatory Circular"
    OPERATIONAL = "operational", "Operational Notice"


class Announcement(models.Model):
    slug = models.SlugField(
        max_length=120,
        unique=True,
        help_text="Unique slug identifier (e.g. fy2025-results)",
    )
    category = models.CharField(
        max_length=20,
        choices=AnnouncementCategory.choices,
        default=AnnouncementCategory.CUSTOMER,
    )
    title = models.CharField(max_length=255)
    date_display = models.CharField(max_length=60, help_text="e.g. 28 March 2026")
    summary = models.TextField()
    circular_ref = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="e.g. ZSE: CBZ / CIR-03-2026",
    )
    is_urgent = models.BooleanField(default=False)
    file_size = models.CharField(
        max_length=50, blank=True, null=True, help_text="e.g. PDF · 3.4 MB"
    )
    file_url = models.CharField(max_length=500, blank=True, null=True)
    tag = models.CharField(max_length=80, help_text="e.g. Dividend & Results")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]
        indexes = [
            models.Index(fields=["category", "is_active"]),
            models.Index(fields=["is_urgent", "is_active"]),
        ]

    def __str__(self):
        return f"[{self.category.upper()}] {self.title}"


class ContactChannel(models.Model):
    slug = models.SlugField(max_length=80, unique=True)
    name = models.CharField(max_length=150)
    description = models.CharField(max_length=255)
    value = models.CharField(max_length=120)
    action_text = models.CharField(max_length=80)
    action_href = models.CharField(max_length=255)
    badge = models.CharField(max_length=80, blank=True, null=True)
    icon_name = models.CharField(max_length=50)
    availability = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.name} ({self.value})"


class CorporateFact(models.Model):
    key = models.CharField(max_length=80, unique=True)
    label = models.CharField(max_length=120)
    value = models.CharField(max_length=255)
    confirmed = models.BooleanField(default=True)
    note = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "key"]

    def __str__(self):
        return f"{self.label}: {self.value}"
