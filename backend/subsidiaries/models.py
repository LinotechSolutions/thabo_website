from django.db import models


class Subsidiary(models.Model):
    id = models.CharField(max_length=64, primary_key=True)  # slug: bank, insurance, etc.
    name = models.CharField(max_length=150)
    category = models.CharField(max_length=100)
    description = models.TextField()
    cta = models.CharField(max_length=150)
    screen = models.CharField(max_length=64, blank=True, null=True)
    tagline = models.CharField(max_length=255)
    is_core = models.BooleanField(default=False)
    image = models.CharField(max_length=255)
    logo = models.CharField(max_length=255, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Subsidiaries"
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class LifecycleStage(models.Model):
    subsidiary = models.ForeignKey(
        Subsidiary, on_delete=models.CASCADE, related_name="lifecycle_stages"
    )
    step = models.CharField(max_length=10)  # e.g. "01"
    phase = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    description = models.TextField()
    deliverables = models.JSONField(default=list, blank=True)
    partner_entity = models.CharField(max_length=100, blank=True, null=True)
    tag = models.CharField(max_length=64, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["subsidiary", "order", "step"]

    def __str__(self):
        return f"{self.subsidiary_id} - Step {self.step}: {self.title}"


class Audience(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon_name = models.CharField(max_length=50)
    image = models.CharField(max_length=255)
    tag = models.CharField(max_length=50)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title


class LifeStage(models.Model):
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=255)
    icon_name = models.CharField(max_length=50)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title


class Goal(models.Model):
    label = models.CharField(max_length=150)
    route = models.CharField(max_length=100, blank=True, null=True)
    subsidiary = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.label
