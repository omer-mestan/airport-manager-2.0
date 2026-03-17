from django.shortcuts import render


def home(request):
    context = {
        "project_name": "Airport Manager 2.0",
        "links": [
            {"label": "API Docs", "url": "/api/docs/", "description": "Browse the Swagger documentation."},
            {"label": "Flights API", "url": "/api/flights/", "description": "View seeded and live flight records."},
            {"label": "Admin Panel", "url": "/admin/", "description": "Manage users, flights, and related data."},
            {"label": "Crew Dashboard API", "url": "/api/dashboard/crew/", "description": "Summary data for crew assignments."},
            {"label": "Admin Dashboard API", "url": "/api/dashboard/admin/", "description": "Operational overview for admins."},
        ],
        "demo_accounts": [
            {"role": "Admin", "email": "admin@airportmanager.dev", "password": "admin12345"},
            {"role": "Crew", "email": "crew@airportmanager.dev", "password": "crew12345"},
            {"role": "Passenger", "email": "passenger@airportmanager.dev", "password": "passenger12345"},
        ],
    }
    return render(request, "home.html", context)
