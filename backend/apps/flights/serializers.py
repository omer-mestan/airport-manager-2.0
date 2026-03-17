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

    def validate(self, attrs):
        origin_airport = attrs.get("origin_airport") or getattr(self.instance, "origin_airport", None)
        destination_airport = attrs.get("destination_airport") or getattr(self.instance, "destination_airport", None)
        departure_time = attrs.get("departure_time") or getattr(self.instance, "departure_time", None)
        arrival_time = attrs.get("arrival_time") or getattr(self.instance, "arrival_time", None)

        if origin_airport and destination_airport and origin_airport == destination_airport:
            raise serializers.ValidationError(
                {"destination_airport": "Destination airport must be different from the origin airport."}
            )

        if departure_time and arrival_time and arrival_time <= departure_time:
            raise serializers.ValidationError(
                {"arrival_time": "Arrival time must be later than the departure time."}
            )

        return attrs
