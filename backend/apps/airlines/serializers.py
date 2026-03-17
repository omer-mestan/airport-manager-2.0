from rest_framework import serializers

from apps.airlines.models import Airline


class AirlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airline
        fields = "__all__"
