from django.conf import settings
from django.db import models


class CrewPosition(models.TextChoices):
    CAPTAIN = "CAPTAIN", "Captain"
    FIRST_OFFICER = "FIRST_OFFICER", "First Officer"
    CABIN_CREW = "CABIN_CREW", "Cabin Crew"
    GROUND_STAFF = "GROUND_STAFF", "Ground Staff"


class CrewProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="crew_profile")
    employee_id = models.CharField(max_length=50, unique=True)
    position = models.CharField(max_length=30, choices=CrewPosition.choices)

    class Meta:
        ordering = ("employee_id",)

    def __str__(self):
        return f"{self.employee_id} - {self.user.full_name}"

# Create your models here.
