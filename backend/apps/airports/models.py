from django.db import models


class Airport(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=120)
    country = models.CharField(max_length=120)

    class Meta:
        ordering = ("code",)

    def __str__(self):
        return f"{self.code} - {self.city}"

# Create your models here.
