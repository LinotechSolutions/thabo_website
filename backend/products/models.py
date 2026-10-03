from django.db import models
from subsidiaries.models import Subsidiary


class ProductItem(models.Model):
    subsidiary = models.ForeignKey(
        Subsidiary, on_delete=models.CASCADE, related_name="products"
    )
    category = models.CharField(
        max_length=50,
        help_text="Product category within subsidiary, e.g. accounts, loans, cards, personal, business, residential",
    )
    item_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Unique product identifier slug, e.g. platinum_card",
    )
    name = models.CharField(max_length=200)
    description = models.TextField()
    pricing = models.CharField(max_length=100, default="Contact us for rates")
    image = models.CharField(max_length=255, blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["subsidiary", "category", "order", "name"]
        indexes = [
            models.Index(fields=["subsidiary", "category"]),
        ]

    def __str__(self):
        return f"[{self.subsidiary_id.upper()}] {self.category} - {self.name}"
