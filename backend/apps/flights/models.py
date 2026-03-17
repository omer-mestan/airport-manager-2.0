from django.db import models

from apps.airlines.models import Airline
from apps.airports.models import Airport
from apps.crews.models import CrewProfile


class FlightStatus(models.TextChoices):
    SCHEDULED = "SCHEDULED", "Scheduled"
    BOARDING = "BOARDING", "Boarding"
    ON_TIME = "ON_TIME", "On Time"
    DELAYED = "DELAYED", "Delayed"
    CANCELLED = "CANCELLED", "Cancelled"


class Aircraft(models.Model):
    airline = models.ForeignKey(Airline, on_delete=models.CASCADE, related_name="aircraft")
    model = models.CharField(max_length=100)
    registration_number = models.CharField(max_length=50, unique=True)
    capacity = models.PositiveIntegerField()

    class Meta:
        ordering = ("registration_number",)

    def __str__(self):
        return self.registration_number


class Flight(models.Model):
    flight_number = models.CharField(max_length=20, unique=True)
    airline = models.ForeignKey(Airline, on_delete=models.CASCADE, related_name="flights")
    origin_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name="departing_flights")
    destination_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name="arriving_flights")
    aircraft = models.ForeignKey(Aircraft, on_delete=models.CASCADE, related_name="flights")
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    gate = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, choices=FlightStatus.choices, default=FlightStatus.SCHEDULED)

    class Meta:
        ordering = ("departure_time",)

    def __str__(self):
        return self.flight_number


class FlightCrewAssignment(models.Model):
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name="crew_assignments")
    crew_profile = models.ForeignKey(CrewProfile, on_delete=models.CASCADE, related_name="flight_assignments")
    duty_role = models.CharField(max_length=100)

    class Meta:
        ordering = ("flight__departure_time",)
        unique_together = ("flight", "crew_profile")

    def __str__(self):
        return f"{self.flight.flight_number} - {self.crew_profile.employee_id}"

# Create your models here.
