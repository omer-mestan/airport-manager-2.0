# Airport Manager 2.0

Airport Manager 2.0 is a full-stack web platform for airport flight operations, crew management, and passenger-facing flight tracking.

This project is built as an internship-ready portfolio application and focuses on realistic workflows, role-based access, API quality, and a clean dashboard experience.

## Main Goals

- build a production-style full-stack project
- demonstrate backend and frontend integration
- show role-based access control and business logic
- present a clean and professional GitHub repository

## Planned Features

- JWT authentication
- user roles: `Passenger`, `CrewMember`, `Admin`
- flights CRUD
- airport, airline, aircraft, and crew management
- search and filtering by destination, status, airline, and departure time
- passenger flights board
- crew dashboard
- admin operations dashboard
- analytics cards and charts
- OpenAPI / Swagger documentation
- automated tests

## Tech Stack

- Backend: Django, Django REST Framework
- Frontend: React, Vite
- Database: PostgreSQL
- Auth: JWT
- Styling: Tailwind CSS
- Charts: Recharts
- Docs: drf-spectacular

## Repository Structure

```text
airport-manager-2.0/
  backend/
  frontend/
  docs/
    ARCHITECTURE.md
    ROADMAP.md
    TASKS.md
```

## Current Status

Backend foundation is now set up with:

- Django project structure
- custom user model with roles
- JWT authentication endpoints
- airport, airline, crew, aircraft, and flight models
- DRF viewsets for core resources
- Swagger documentation support

Next milestone:

- add seed data and tests
- scaffold the React frontend
- connect frontend dashboards to the API

## Why This Project Matters

Airport operations require accurate scheduling, clear permissions, and usable interfaces for both staff and passengers. This project simulates those workflows through a structured API and multiple dashboards.

## Portfolio Value

This repository is intended to showcase:

- REST API design
- relational database modeling
- authentication and permissions
- full-stack architecture
- testing and documentation

## Roadmap

See:

- `docs/ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/TASKS.md`

## Backend Quick Start

From `backend/` run:

```bash
..\..\venv\Scripts\python.exe manage.py migrate
..\..\venv\Scripts\python.exe manage.py runserver
```

Useful URLs:

- `http://127.0.0.1:8000/api/docs/`
- `http://127.0.0.1:8000/api/schema/`
- `http://127.0.0.1:8000/admin/`

## Future Improvements

- real-time updates with WebSockets
- notifications for delays and cancellations
- audit log for admin changes
- Docker support
- CI pipeline
- deployment to Render and Vercel
