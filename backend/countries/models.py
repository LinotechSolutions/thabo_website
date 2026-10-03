from django.db import models


class Country(models.Model):
    code = models.CharField(max_length=8, unique=True, primary_key=True)  # e.g. "zw"
    name = models.CharField(max_length=100)
    iso = models.CharField(max_length=4)  # "ZW"
    cur = models.CharField(max_length=50)  # "USD / ZWG"
    dial = models.CharField(max_length=10)  # "+263"
    illustrative = models.BooleanField(default=False)
    regulator = models.CharField(max_length=200, blank=True, null=True)
    pcur = models.CharField(max_length=10)  # "USD"
    rate = models.FloatField(default=1.0)
    rates = models.JSONField(default=list, blank=True)

    class Meta:
        verbose_name_plural = "Countries"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.iso})"
