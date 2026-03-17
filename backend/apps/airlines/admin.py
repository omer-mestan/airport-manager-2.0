from django.contrib import admin

from apps.airlines.models import Airline


@admin.register(Airline)
class AirlineAdmin(admin.ModelAdmin):
    list_display = ("name", "code")
    search_fields = ("name", "code")

# Register your models here.
