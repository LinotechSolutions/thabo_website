from django.db import models


class Biller(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    name = models.CharField(max_length=150)
    category = models.CharField(max_length=100)
    icon_name = models.CharField(max_length=50)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.name} ({self.category})"
