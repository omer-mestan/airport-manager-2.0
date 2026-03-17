from django.contrib import admin

from apps.airports.models import Airport


@admin.register(Airport)
class AirportAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "city", "country")
    search_fields = ("code", "name", "city", "country")

# Register your models here.
