from django.contrib import admin

from apps.flights.models import Aircraft, Flight, FlightCrewAssignment


@admin.register(Aircraft)
class AircraftAdmin(admin.ModelAdmin):
    list_display = ("registration_number", "model", "airline", "capacity")
    search_fields = ("registration_number", "model", "airline__name")


class FlightCrewAssignmentInline(admin.TabularInline):
    model = FlightCrewAssignment
    extra = 1


@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ("flight_number", "airline", "origin_airport", "destination_airport", "departure_time", "status")
    list_filter = ("status", "airline")
    search_fields = ("flight_number", "airline__name")
    inlines = [FlightCrewAssignmentInline]

# Register your models here.
