from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter

from apps.airlines.views import AirlineViewSet
from apps.analytics.views import AdminDashboardView, CrewDashboardView
from apps.airports.views import AirportViewSet
from apps.crews.views import CrewProfileViewSet, MyCrewAssignmentsView
from apps.flights.views import AircraftViewSet, FlightViewSet

router = DefaultRouter()
router.register("airports", AirportViewSet, basename="airport")
router.register("airlines", AirlineViewSet, basename="airline")
router.register("aircraft", AircraftViewSet, basename="aircraft")
router.register("crew-profiles", CrewProfileViewSet, basename="crew-profile")
router.register("flights", FlightViewSet, basename="flight")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/auth/', include('apps.users.urls')),
    path('api/dashboard/admin/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('api/dashboard/crew/', CrewDashboardView.as_view(), name='crew-dashboard'),
    path('api/crew/my-assignments/', MyCrewAssignmentsView.as_view(), name='my-assignments'),
    path('api/', include(router.urls)),
]
