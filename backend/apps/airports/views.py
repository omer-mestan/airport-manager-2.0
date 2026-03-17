from rest_framework import viewsets

from apps.airports.models import Airport
from apps.airports.serializers import AirportSerializer
from config.permissions import IsAdminOrReadOnly


class AirportViewSet(viewsets.ModelViewSet):
    queryset = Airport.objects.all()
    serializer_class = AirportSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ("code", "name", "city", "country")
    ordering_fields = ("code", "city", "country")

# Create your views here.
