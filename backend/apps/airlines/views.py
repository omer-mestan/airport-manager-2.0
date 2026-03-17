from rest_framework import viewsets

from apps.airlines.models import Airline
from apps.airlines.serializers import AirlineSerializer
from config.permissions import IsAdminOrReadOnly


class AirlineViewSet(viewsets.ModelViewSet):
    queryset = Airline.objects.all()
    serializer_class = AirlineSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ("name", "code")
    ordering_fields = ("name", "code")

# Create your views here.
