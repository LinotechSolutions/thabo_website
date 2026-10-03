from django.contrib import admin
from insurance.models import AddonOption, AssetOption, CoverOption, InsuranceQuote


@admin.register(AssetOption)
class AssetOptionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "entity", "order")


@admin.register(CoverOption)
class CoverOptionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "tier", "base_price_usd", "rate_percentage", "order")


@admin.register(AddonOption)
class AddonOptionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price_usd", "entity", "order")


@admin.register(InsuranceQuote)
class InsuranceQuoteAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "asset",
        "cover",
        "monthly_premium_usd",
        "annual_premium_usd",
        "created_at",
    )
    list_filter = ("asset", "cover", "created_at")
    readonly_fields = [f.name for f in InsuranceQuote._meta.fields]
