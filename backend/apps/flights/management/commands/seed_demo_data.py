from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.airlines.models import Airline
from apps.airports.models import Airport
from apps.crews.models import CrewPosition, CrewProfile
from apps.flights.models import Aircraft, Flight, FlightCrewAssignment, FlightStatus
from apps.users.models import User, UserRole


class Command(BaseCommand):
    help = "Seed the database with demo airport data for local development."

    @transaction.atomic
    def handle(self, *args, **options):
        admin_user, _ = User.objects.get_or_create(
            email="admin@airportmanager.dev",
            defaults={
                "full_name": "Airport Admin",
                "role": UserRole.ADMIN,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        admin_user.set_password("admin12345")
        admin_user.save()

        crew_user, _ = User.objects.get_or_create(
            email="crew@airportmanager.dev",
            defaults={
                "full_name": "Maria Ivanova",
                "role": UserRole.CREW_MEMBER,
            },
        )
        crew_user.set_password("crew12345")
        crew_user.save()

        passenger_user, _ = User.objects.get_or_create(
            email="passenger@airportmanager.dev",
            defaults={
                "full_name": "Ivan Petrov",
                "role": UserRole.PASSENGER,
            },
        )
        passenger_user.set_password("passenger12345")
        passenger_user.save()

        sofia, _ = Airport.objects.get_or_create(
            code="SOF",
            defaults={"name": "Sofia Airport", "city": "Sofia", "country": "Bulgaria"},
        )
        heathrow, _ = Airport.objects.get_or_create(
            code="LHR",
            defaults={"name": "Heathrow Airport", "city": "London", "country": "United Kingdom"},
        )
        frankfurt, _ = Airport.objects.get_or_create(
            code="FRA",
            defaults={"name": "Frankfurt Airport", "city": "Frankfurt", "country": "Germany"},
        )

        airline, _ = Airline.objects.get_or_create(name="Bulgaria Air", code="FB")
        aircraft, _ = Aircraft.objects.get_or_create(
            registration_number="LZ-AM2",
            defaults={
                "airline": airline,
                "model": "Airbus A220-300",
                "capacity": 145,
            },
        )

        crew_profile, _ = CrewProfile.objects.get_or_create(
            user=crew_user,
            defaults={
                "employee_id": "CM-2001",
                "position": CrewPosition.CAPTAIN,
            },
        )

        now = timezone.now()
        flights = [
            {
                "flight_number": "FB301",
                "origin_airport": sofia,
                "destination_airport": heathrow,
                "departure_time": now + timedelta(hours=3),
                "arrival_time": now + timedelta(hours=6),
                "gate": "A1",
                "status": FlightStatus.BOARDING,
            },
            {
                "flight_number": "FB401",
                "origin_airport": sofia,
                "destination_airport": frankfurt,
                "departure_time": now + timedelta(hours=5),
                "arrival_time": now + timedelta(hours=7),
                "gate": "B4",
                "status": FlightStatus.DELAYED,
            },
            {
                "flight_number": "FB777",
                "origin_airport": heathrow,
                "destination_airport": sofia,
                "departure_time": now + timedelta(hours=8),
                "arrival_time": now + timedelta(hours=11),
                "gate": "C2",
                "status": FlightStatus.SCHEDULED,
            },
        ]

        for flight_data in flights:
            flight, _ = Flight.objects.get_or_create(
                flight_number=flight_data["flight_number"],
                defaults={
                    **flight_data,
                    "airline": airline,
                    "aircraft": aircraft,
                },
            )
            FlightCrewAssignment.objects.get_or_create(
                flight=flight,
                crew_profile=crew_profile,
                defaults={"duty_role": "Captain"},
            )

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully."))
        self.stdout.write("Admin: admin@airportmanager.dev / admin12345")
        self.stdout.write("Crew: crew@airportmanager.dev / crew12345")
        self.stdout.write("Passenger: passenger@airportmanager.dev / passenger12345")
