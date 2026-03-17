from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.airlines.models import Airline
from apps.airports.models import Airport
from apps.crews.models import CrewProfile
from apps.flights.models import Aircraft, Flight, FlightCrewAssignment, FlightStatus
from apps.users.models import User, UserRole


class DashboardApiTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email="admin@example.com",
            full_name="Admin User",
            role=UserRole.ADMIN,
            password="strongpass123",
            is_staff=True,
        )
        self.crew_user = User.objects.create_user(
            email="crew@example.com",
            full_name="Crew User",
            role=UserRole.CREW_MEMBER,
            password="strongpass123",
        )
        self.passenger = User.objects.create_user(
            email="passenger@example.com",
            full_name="Passenger User",
            role=UserRole.PASSENGER,
            password="strongpass123",
        )
        self.airline = Airline.objects.create(name="Bulgaria Air", code="FB")
        self.origin = Airport.objects.create(code="SOF", name="Sofia Airport", city="Sofia", country="Bulgaria")
        self.destination = Airport.objects.create(code="FRA", name="Frankfurt Airport", city="Frankfurt", country="Germany")
        self.aircraft = Aircraft.objects.create(
            airline=self.airline,
            model="Airbus A220",
            registration_number="LZ-DASH",
            capacity=120,
        )
        self.crew_profile = CrewProfile.objects.create(
            user=self.crew_user,
            employee_id="CM-1001",
            position="CAPTAIN",
        )
        self.flight = Flight.objects.create(
            flight_number="FB401",
            airline=self.airline,
            origin_airport=self.origin,
            destination_airport=self.destination,
            aircraft=self.aircraft,
            departure_time=timezone.now() + timedelta(hours=2),
            arrival_time=timezone.now() + timedelta(hours=4),
            gate="C3",
            status=FlightStatus.DELAYED,
        )
        FlightCrewAssignment.objects.create(
            flight=self.flight,
            crew_profile=self.crew_profile,
            duty_role="Captain",
        )

    def test_admin_dashboard_returns_summary(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.get("/api/dashboard/admin/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_flights"], 1)
        self.assertEqual(response.data["delayed_flights"], 1)

    def test_crew_dashboard_returns_assignments(self):
        self.client.force_authenticate(user=self.crew_user)

        response = self.client.get("/api/dashboard/crew/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_assignments"], 1)
        self.assertEqual(response.data["next_flight"]["flight_number"], "FB401")

    def test_passenger_cannot_open_admin_dashboard(self):
        self.client.force_authenticate(user=self.passenger)

        response = self.client.get("/api/dashboard/admin/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
