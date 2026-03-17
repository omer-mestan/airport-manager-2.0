# Architecture

## Backend Apps

- `users`
- `airports`
- `airlines`
- `flights`
- `crews`
- `notifications`
- `analytics`

## Core Models

### User

- email
- password
- full_name
- role

### Airport

- code
- name
- city
- country

### Airline

- name
- code

### Aircraft

- model
- registration_number
- capacity

### Flight

- flight_number
- airline
- origin_airport
- destination_airport
- aircraft
- departure_time
- arrival_time
- gate
- status

### FlightCrewAssignment

- flight
- crew_member
- duty_role

## Frontend Areas

- auth
- flights board
- flight details
- crew dashboard
- admin dashboard
- analytics

## Recommended Stack

- Django REST Framework
- PostgreSQL
- React + Vite
- Tailwind CSS
- Recharts
- JWT auth
