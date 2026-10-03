from django.contrib import admin
from subsidiaries.models import Audience, Goal, LifecycleStage, LifeStage, Subsidiary


class LifecycleStageInline(admin.TabularInline):
    model = LifecycleStage
    extra = 1


@admin.register(Subsidiary)
class SubsidiaryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category", "screen", "is_core", "order")
    list_filter = ("category", "is_core")
    search_fields = ("name", "id", "description")
    inlines = [LifecycleStageInline]


@admin.register(LifecycleStage)
class LifecycleStageAdmin(admin.ModelAdmin):
    list_display = ("subsidiary", "step", "phase", "title", "order")
    list_filter = ("subsidiary", "phase")


@admin.register(Audience)
class AudienceAdmin(admin.ModelAdmin):
    list_display = ("title", "tag", "order")


@admin.register(LifeStage)
class LifeStageAdmin(admin.ModelAdmin):
    list_display = ("title", "subtitle", "order")


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ("label", "route", "subsidiary", "order")
