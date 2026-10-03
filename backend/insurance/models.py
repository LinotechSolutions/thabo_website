from django.conf import settings
from django.db import models


class AssetOption(models.Model):
    id = models.CharField(max_length=64, primary_key=True)  # e.g. "asset-private-motor"
    name = models.CharField(max_length=150)
    description = models.TextField()
    entity = models.CharField(max_length=100)  # e.g. "CBZ Insurance Limited"
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class CoverOption(models.Model):
    id = models.CharField(max_length=64, primary_key=True)  # "thirdparty", "fullthird", "comprehensive"
    name = models.CharField(max_length=150)
    tier = models.CharField(max_length=50)
    base_price_usd = models.DecimalField(max_digits=10, decimal_places=2)  # 14.00, 27.00, 46.00
    rate_percentage = models.FloatField(
        default=0.0,
        help_text="Annual rate percentage applied to vehicle value (e.g. 0.045 for 4.5% comprehensive)",
    )
    features = models.JSONField(default=list, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.name} (${self.base_price_usd}/mo)"


class AddonOption(models.Model):
    id = models.CharField(max_length=64, primary_key=True)  # "addon-roadside", etc.
    name = models.CharField(max_length=150)
    entity = models.CharField(max_length=100)
    description = models.TextField()
    price_usd = models.DecimalField(max_digits=10, decimal_places=2)  # 9.00, 6.00, 0.00, 18.00
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.name} (+${self.price_usd}/mo)"


class InsuranceQuote(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="quotes",
    )
    asset = models.ForeignKey(AssetOption, on_delete=models.CASCADE)
    cover = models.ForeignKey(CoverOption, on_delete=models.CASCADE)
    selected_addons = models.JSONField(default=list, blank=True)
    vehicle_make = models.CharField(max_length=100, blank=True)
    vehicle_model = models.CharField(max_length=100, blank=True)
    vehicle_year = models.PositiveIntegerField(null=True, blank=True)
    vehicle_value_usd = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    reg_number = models.CharField(max_length=50, blank=True)
    overnight_location = models.CharField(max_length=100, blank=True)
    monthly_premium_usd = models.DecimalField(max_digits=10, decimal_places=2)
    annual_premium_usd = models.DecimalField(max_digits=10, decimal_places=2)
    breakdown = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Quote #{self.id} - ${self.monthly_premium_usd}/mo ({self.cover_id})"
