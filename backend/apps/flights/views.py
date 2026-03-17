from rest_framework import viewsets

from apps.flights.models import Aircraft, Flight
from apps.flights.serializers import AircraftSerializer, FlightSerializer
from config.permissions import IsAdminOrReadOnly


class AircraftViewSet(viewsets.ModelViewSet):
    queryset = Aircraft.objects.select_related("airline").all()
    serializer_class = AircraftSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ("registration_number", "model", "airline__name")
    ordering_fields = ("registration_number", "capacity")


class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.select_related(
        "airline",
        "origin_airport",
        "destination_airport",
        "aircraft",
    ).prefetch_related(
        "crew_assignments",
        "crew_assignments__crew_profile",
        "crew_assignments__crew_profile__user",
    )
    serializer_class = FlightSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ("status", "airline", "origin_airport", "destination_airport")
    search_fields = (
        "flight_number",
        "airline__name",
        "origin_airport__code",
        "destination_airport__code",
    )
    ordering_fields = ("departure_time", "arrival_time", "flight_number")

# Create your views here.
