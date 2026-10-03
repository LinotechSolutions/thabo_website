from django.contrib import admin
from countries.models import Country


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "iso", "cur", "dial", "illustrative", "rate")
    search_fields = ("name", "code", "iso")
