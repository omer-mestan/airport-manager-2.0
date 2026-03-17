from rest_framework import generics, viewsets

from apps.crews.models import CrewProfile
from apps.crews.serializers import CrewProfileSerializer
from apps.flights.models import FlightCrewAssignment
from apps.flights.serializers import FlightCrewAssignmentSerializer
from config.permissions import IsAdminOrReadOnly, IsCrewOrAdmin


class CrewProfileViewSet(viewsets.ModelViewSet):
    queryset = CrewProfile.objects.select_related("user").all()
    serializer_class = CrewProfileSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ("employee_id", "user__email", "user__full_name")
    ordering_fields = ("employee_id", "position")


class MyCrewAssignmentsView(generics.ListAPIView):
    serializer_class = FlightCrewAssignmentSerializer
    permission_classes = [IsCrewOrAdmin]

    def get_queryset(self):
        queryset = FlightCrewAssignment.objects.select_related(
            "flight",
            "flight__airline",
            "flight__origin_airport",
            "flight__destination_airport",
            "crew_profile",
            "crew_profile__user",
        )
        user = self.request.user
        if user.role == "ADMIN":
            return queryset
        return queryset.filter(crew_profile__user=user)

# Create your views here.
