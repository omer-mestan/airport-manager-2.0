from django.db.models import Count
from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from apps.airlines.models import Airline
from apps.airports.models import Airport
from apps.crews.models import CrewProfile
from apps.flights.models import Flight, FlightCrewAssignment, FlightStatus
from apps.users.models import UserRole
from config.permissions import IsAdminRole, IsCrewOrAdmin


class AdminDashboardView(generics.GenericAPIView):
    permission_classes = [IsAdminRole]

    def get(self, request, *args, **kwargs):
        now = timezone.now()
        upcoming_queryset = Flight.objects.select_related(
            "airline",
            "origin_airport",
            "destination_airport",
        ).filter(departure_time__gte=now).order_by("departure_time")[:5]

        flights_by_status = (
            Flight.objects.values("status")
            .annotate(count=Count("id"))
            .order_by("status")
        )

        data = {
            "total_flights": Flight.objects.count(),
            "delayed_flights": Flight.objects.filter(status=FlightStatus.DELAYED).count(),
            "cancelled_flights": Flight.objects.filter(status=FlightStatus.CANCELLED).count(),
            "total_airports": Airport.objects.count(),
            "total_airlines": Airline.objects.count(),
            "total_crew_members": CrewProfile.objects.count(),
            "upcoming_flights": [
                {
                    "flight_number": flight.flight_number,
                    "airline": flight.airline.name,
                    "origin": flight.origin_airport.code,
                    "destination": flight.destination_airport.code,
                    "departure_time": flight.departure_time,
                    "status": flight.status,
                }
                for flight in upcoming_queryset
            ],
            "flights_by_status": list(flights_by_status),
        }
        return Response(data)


class CrewDashboardView(generics.GenericAPIView):
    permission_classes = [IsCrewOrAdmin]

    def get(self, request, *args, **kwargs):
        assignments = FlightCrewAssignment.objects.select_related(
            "flight",
            "flight__airline",
            "flight__origin_airport",
            "flight__destination_airport",
            "crew_profile",
            "crew_profile__user",
        ).order_by("flight__departure_time")
        if request.user.role != UserRole.ADMIN:
            assignments = assignments.filter(crew_profile__user=request.user)

        now = timezone.now()
        assignment_items = [
            {
                "flight_number": assignment.flight.flight_number,
                "duty_role": assignment.duty_role,
                "departure_time": assignment.flight.departure_time,
                "status": assignment.flight.status,
                "origin": assignment.flight.origin_airport.code,
                "destination": assignment.flight.destination_airport.code,
            }
            for assignment in assignments[:10]
        ]

        next_assignment = assignments.filter(flight__departure_time__gte=now).first()
        next_flight = None
        if next_assignment:
            next_flight = {
                "flight_number": next_assignment.flight.flight_number,
                "departure_time": next_assignment.flight.departure_time,
                "origin": next_assignment.flight.origin_airport.code,
                "destination": next_assignment.flight.destination_airport.code,
                "status": next_assignment.flight.status,
            }

        data = {
            "total_assignments": assignments.count(),
            "upcoming_assignments": assignments.filter(flight__departure_time__gte=now).count(),
            "next_flight": next_flight,
            "assignments": assignment_items,
        }
        return Response(data)
