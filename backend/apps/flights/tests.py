from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.airlines.models import Airline
from apps.airports.models import Airport
from apps.flights.models import Aircraft, Flight
from apps.users.models import User, UserRole


class FlightApiTests(APITestCase):
    def setUp(self):
        self.airline = Airline.objects.create(name="Bulgaria Air", code="FB")
        self.origin = Airport.objects.create(code="SOF", name="Sofia Airport", city="Sofia", country="Bulgaria")
        self.destination = Airport.objects.create(code="LHR", name="Heathrow", city="London", country="UK")
        self.aircraft = Aircraft.objects.create(
            airline=self.airline,
            model="Airbus A220",
            registration_number="LZ-TEST",
            capacity=120,
        )
        self.flight = Flight.objects.create(
            flight_number="FB123",
            airline=self.airline,
            origin_airport=self.origin,
            destination_airport=self.destination,
            aircraft=self.aircraft,
            departure_time=timezone.now(),
            arrival_time=timezone.now() + timedelta(hours=3),
            gate="A2",
            status="SCHEDULED",
        )

    def test_flights_are_publicly_listed(self):
        response = self.client.get("/api/flights/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"][0]["flight_number"], self.flight.flight_number)

    def test_only_admin_can_create_flight(self):
        payload = {
            "flight_number": "FB555",
            "airline": self.airline.id,
            "origin_airport": self.origin.id,
            "destination_airport": self.destination.id,
            "aircraft": self.aircraft.id,
            "departure_time": timezone.now().isoformat(),
            "arrival_time": (timezone.now() + timedelta(hours=2)).isoformat(),
            "gate": "B1",
            "status": "ON_TIME",
        }

        passenger = User.objects.create_user(
            email="passenger@example.com",
            full_name="Regular Passenger",
            role=UserRole.PASSENGER,
            password="strongpass123",
        )
        self.client.force_authenticate(user=passenger)

        response = self.client.post("/api/flights/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_cannot_create_flight_with_same_origin_and_destination(self):
        admin = User.objects.create_user(
            email="admin@example.com",
            full_name="Admin User",
            role=UserRole.ADMIN,
            password="strongpass123",
        )
        self.client.force_authenticate(user=admin)

        payload = {
            "flight_number": "FB556",
            "airline": self.airline.id,
            "origin_airport": self.origin.id,
            "destination_airport": self.origin.id,
            "aircraft": self.aircraft.id,
            "departure_time": timezone.now().isoformat(),
            "arrival_time": (timezone.now() + timedelta(hours=2)).isoformat(),
            "gate": "B2",
            "status": "ON_TIME",
        }

        response = self.client.post("/api/flights/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("destination_airport", response.data)

    def test_admin_cannot_create_flight_with_invalid_time_order(self):
        admin = User.objects.create_user(
            email="admin2@example.com",
            full_name="Admin User 2",
            role=UserRole.ADMIN,
            password="strongpass123",
        )
        self.client.force_authenticate(user=admin)

        departure = timezone.now()
        payload = {
            "flight_number": "FB557",
            "airline": self.airline.id,
            "origin_airport": self.origin.id,
            "destination_airport": self.destination.id,
            "aircraft": self.aircraft.id,
            "departure_time": departure.isoformat(),
            "arrival_time": departure.isoformat(),
            "gate": "B3",
            "status": "ON_TIME",
        }

        response = self.client.post("/api/flights/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("arrival_time", response.data)

# Create your tests here.
