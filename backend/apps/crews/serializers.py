from rest_framework import serializers

from apps.crews.models import CrewProfile


class CrewProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_full_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = CrewProfile
        fields = ("id", "user", "user_email", "user_full_name", "employee_id", "position")
