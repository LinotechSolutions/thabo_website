from django.contrib import admin
from products.models import ProductItem


@admin.register(ProductItem)
class ProductItemAdmin(admin.ModelAdmin):
    list_display = ("name", "subsidiary", "category", "pricing", "is_active", "order")
    list_filter = ("subsidiary", "category", "is_active")
    search_fields = ("name", "description", "item_id")
