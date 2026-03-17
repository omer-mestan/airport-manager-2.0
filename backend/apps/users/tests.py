from rest_framework import status
from rest_framework.test import APITestCase

from apps.users.models import User, UserRole


class RegistrationTests(APITestCase):
    def test_user_can_register(self):
        payload = {
            "email": "passenger@example.com",
            "full_name": "Test Passenger",
            "role": UserRole.PASSENGER,
            "password": "strongpass123",
        }

        response = self.client.post("/api/auth/register/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=payload["email"]).exists())

    def test_authenticated_user_can_fetch_profile(self):
        user = User.objects.create_user(
            email="crew@example.com",
            full_name="Crew Member",
            role=UserRole.CREW_MEMBER,
            password="strongpass123",
        )
        self.client.force_authenticate(user=user)

        response = self.client.get("/api/auth/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], user.email)

# Create your tests here.
