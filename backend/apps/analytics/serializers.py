from rest_framework import serializers


class AdminDashboardSerializer(serializers.Serializer):
    total_flights = serializers.IntegerField()
    delayed_flights = serializers.IntegerField()
    cancelled_flights = serializers.IntegerField()
    total_airports = serializers.IntegerField()
    total_airlines = serializers.IntegerField()
    total_crew_members = serializers.IntegerField()
    upcoming_flights = serializers.ListField(child=serializers.DictField())
    flights_by_status = serializers.ListField(child=serializers.DictField())


class CrewDashboardSerializer(serializers.Serializer):
    total_assignments = serializers.IntegerField()
    upcoming_assignments = serializers.IntegerField()
    next_flight = serializers.DictField(allow_null=True)
    assignments = serializers.ListField(child=serializers.DictField())
