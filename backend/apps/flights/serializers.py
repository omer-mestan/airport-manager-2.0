from rest_framework import serializers

from apps.flights.models import Aircraft, Flight, FlightCrewAssignment


class AircraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aircraft
        fields = "__all__"


class FlightCrewAssignmentSerializer(serializers.ModelSerializer):
    crew_member_name = serializers.CharField(source="crew_profile.user.full_name", read_only=True)
    crew_member_email = serializers.EmailField(source="crew_profile.user.email", read_only=True)

    class Meta:
        model = FlightCrewAssignment
        fields = ("id", "flight", "crew_profile", "crew_member_name", "crew_member_email", "duty_role")


class FlightSerializer(serializers.ModelSerializer):
    crew_assignments = FlightCrewAssignmentSerializer(many=True, read_only=True)
    airline_name = serializers.CharField(source="airline.name", read_only=True)
    origin_code = serializers.CharField(source="origin_airport.code", read_only=True)
    destination_code = serializers.CharField(source="destination_airport.code", read_only=True)

    class Meta:
        model = Flight
        fields = (
            "id",
            "flight_number",
            "airline",
            "airline_name",
            "origin_airport",
            "origin_code",
            "destination_airport",
            "destination_code",
            "aircraft",
            "departure_time",
            "arrival_time",
            "gate",
            "status",
            "crew_assignments",
        )
