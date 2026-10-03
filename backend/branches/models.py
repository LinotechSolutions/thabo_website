from django.db import models


class BranchType(models.TextChoices):
    BRANCH = "branch", "Full Branch"
    AGENCY = "agency", "Agency / Express"
    ATM = "atm", "24/7 ATM"


class Branch(models.Model):
    name = models.CharField(max_length=150)
    branch_type = models.CharField(
        max_length=20, choices=BranchType.choices, default=BranchType.BRANCH
    )
    city = models.CharField(max_length=100, db_index=True)
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    phone = models.CharField(max_length=50, blank=True, default="+263 8677004050")
    hours = models.CharField(
        max_length=100, default="Mon - Fri: 08:00 - 15:00 | Sat: 08:00 - 11:30"
    )
    services = models.JSONField(
        default=list,
        blank=True,
        help_text="List of available services e.g. Forex, Cash, Mortgages, ATMs",
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["city", "name"]
        verbose_name_plural = "Branches"

    def __str__(self):
        return f"{self.name} ({self.get_branch_type_display()}, {self.city})"
