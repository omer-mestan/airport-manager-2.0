import { useEffect, useMemo, useState } from "react";

import {
  createFlight,
  deleteFlight,
  getAdminDashboard,
  getAircraft,
  getAirlines,
  getAirports,
  getFlights,
  updateFlight,
} from "../api";
import { useAuth } from "../auth";
import { SectionPanel } from "../components/SectionPanel";
import { SummaryCard } from "../components/SummaryCard";
import { formatDateTime } from "../utils";

const STATUS_OPTIONS = ["SCHEDULED", "BOARDING", "ON_TIME", "DELAYED", "CANCELLED"];

function createEmptyForm() {
  return {
    flight_number: "",
    airline: "",
    origin_airport: "",
    destination_airport: "",
    aircraft: "",
    departure_time: "",
    arrival_time: "",
    gate: "",
    status: "SCHEDULED",
  };
}

function unwrapResults(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

function toDatetimeLocal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const pad = (part) => String(part).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + "T" + [pad(date.getHours()), pad(date.getMinutes())].join(":");
}

function toApiPayload(form) {
  return {
    ...form,
    airline: Number(form.airline),
    origin_airport: Number(form.origin_airport),
    destination_airport: Number(form.destination_airport),
    aircraft: Number(form.aircraft),
    departure_time: new Date(form.departure_time).toISOString(),
    arrival_time: new Date(form.arrival_time).toISOString(),
  };
}

export function AdminDashboardPage() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [operationsError, setOperationsError] = useState("");
  const [loadingOperations, setLoadingOperations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingFlightId, setEditingFlightId] = useState(null);
  const [form, setForm] = useState(createEmptyForm());

  const airportLabelById = useMemo(
    () => Object.fromEntries(airports.map((item) => [item.id, `${item.code} - ${item.city}`])),
    [airports],
  );

  const aircraftLabelById = useMemo(
    () => Object.fromEntries(aircraft.map((item) => [item.id, `${item.registration_number} - ${item.model}`])),
    [aircraft],
  );

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      try {
        setLoadingDashboard(true);
        const data = await getAdminDashboard(token);
        if (isActive) {
          setDashboard(data);
          setDashboardError("");
        }
      } catch (error) {
        if (isActive) {
          setDashboardError(error.message);
        }
      } finally {
        if (isActive) {
          setLoadingDashboard(false);
        }
      }
    }

    loadDashboard();
    return () => {
      isActive = false;
    };
  }, [token]);

  useEffect(() => {
    let isActive = true;

    async function loadOperationsData() {
      try {
        setLoadingOperations(true);
        const [flightsData, airportsData, airlinesData, aircraftData] = await Promise.all([
          getFlights(),
          getAirports(),
          getAirlines(),
          getAircraft(),
        ]);

        if (isActive) {
          setFlights(unwrapResults(flightsData));
          setAirports(unwrapResults(airportsData));
          setAirlines(unwrapResults(airlinesData));
          setAircraft(unwrapResults(aircraftData));
          setOperationsError("");
        }
      } catch (error) {
        if (isActive) {
          setOperationsError(error.message);
        }
      } finally {
        if (isActive) {
          setLoadingOperations(false);
        }
      }
    }

    loadOperationsData();
    return () => {
      isActive = false;
    };
  }, []);

  function resetForm() {
    setEditingFlightId(null);
    setForm(createEmptyForm());
  }

  function startEditing(flight) {
    setEditingFlightId(flight.id);
    setForm({
      flight_number: flight.flight_number,
      airline: String(flight.airline),
      origin_airport: String(flight.origin_airport),
      destination_airport: String(flight.destination_airport),
      aircraft: String(flight.aircraft),
      departure_time: toDatetimeLocal(flight.departure_time),
      arrival_time: toDatetimeLocal(flight.arrival_time),
      gate: flight.gate || "",
      status: flight.status,
    });
  }

  async function refreshDashboardAndFlights() {
    const [dashboardData, flightsData] = await Promise.all([
      getAdminDashboard(token),
      getFlights(),
    ]);
    setDashboard(dashboardData);
    setFlights(unwrapResults(flightsData));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setOperationsError("");

      const payload = toApiPayload(form);
      if (editingFlightId) {
        await updateFlight(token, editingFlightId, payload);
      } else {
        await createFlight(token, payload);
      }

      await refreshDashboardAndFlights();
      resetForm();
    } catch (error) {
      setOperationsError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(flightId) {
    try {
      setOperationsError("");
      await deleteFlight(token, flightId);
      await refreshDashboardAndFlights();
      if (editingFlightId === flightId) {
        resetForm();
      }
    } catch (error) {
      setOperationsError(error.message);
    }
  }

  return (
    <main className="page-grid">
      <section className="page-heading">
        <p className="eyebrow navy">Admin Dashboard</p>
        <h1>Operations Overview</h1>
        <p className="page-copy">
          Protected summary data for flight operations, delay monitoring, and now real CRUD management from the UI.
        </p>
      </section>

      {loadingDashboard ? <section className="page-panel">Loading dashboard...</section> : null}
      {dashboardError ? <section className="page-panel error-text">{dashboardError}</section> : null}

      {dashboard ? (
        <>
          <div className="summary-grid">
            <SummaryCard label="Total Flights" value={dashboard.total_flights} accent="blue" />
            <SummaryCard label="Delayed" value={dashboard.delayed_flights} accent="amber" />
            <SummaryCard label="Cancelled" value={dashboard.cancelled_flights} accent="rose" />
            <SummaryCard label="Crew Members" value={dashboard.total_crew_members} accent="green" />
          </div>

          <section className="two-column-grid">
            <SectionPanel
              title="Upcoming Flights"
              description="Next departures currently visible to operations."
            >
              <div className="list-card">
                {dashboard.upcoming_flights.map((flight) => (
                  <div key={flight.flight_number} className="list-row">
                    <div>
                      <strong>{flight.flight_number}</strong>
                      <span>{flight.origin} {"->"} {flight.destination}</span>
                    </div>
                    <div>
                      <strong>{flight.status.replaceAll("_", " ")}</strong>
                      <span>{formatDateTime(flight.departure_time)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionPanel>

            <SectionPanel
              title="Status Mix"
              description="Backend aggregation ready for charts and trend panels."
            >
              <div className="list-card">
                {dashboard.flights_by_status.map((item) => (
                  <div key={item.status} className="list-row">
                    <strong>{item.status.replaceAll("_", " ")}</strong>
                    <span>{item.count}</span>
                  </div>
                ))}
              </div>
            </SectionPanel>
          </section>
        </>
      ) : null}

      <section className="two-column-grid admin-ops-grid">
        <SectionPanel
          title={editingFlightId ? "Edit Flight" : "Create Flight"}
          description="This form talks directly to the admin-only Django REST endpoints."
        >
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Flight Number
              <input
                value={form.flight_number}
                onChange={(event) => setForm((current) => ({ ...current, flight_number: event.target.value }))}
                required
              />
            </label>

            <label>
              Airline
              <select
                value={form.airline}
                onChange={(event) => setForm((current) => ({ ...current, airline: event.target.value }))}
                required
              >
                <option value="">Select airline</option>
                {airlines.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Origin Airport
              <select
                value={form.origin_airport}
                onChange={(event) => setForm((current) => ({ ...current, origin_airport: event.target.value }))}
                required
              >
                <option value="">Select origin</option>
                {airports.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} - {item.city}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Destination Airport
              <select
                value={form.destination_airport}
                onChange={(event) => setForm((current) => ({ ...current, destination_airport: event.target.value }))}
                required
              >
                <option value="">Select destination</option>
                {airports.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} - {item.city}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Aircraft
              <select
                value={form.aircraft}
                onChange={(event) => setForm((current) => ({ ...current, aircraft: event.target.value }))}
                required
              >
                <option value="">Select aircraft</option>
                {aircraft.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.registration_number} - {item.model}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Departure Time
              <input
                type="datetime-local"
                value={form.departure_time}
                onChange={(event) => setForm((current) => ({ ...current, departure_time: event.target.value }))}
                required
              />
            </label>

            <label>
              Arrival Time
              <input
                type="datetime-local"
                value={form.arrival_time}
                onChange={(event) => setForm((current) => ({ ...current, arrival_time: event.target.value }))}
                required
              />
            </label>

            <label>
              Gate
              <input
                value={form.gate}
                onChange={(event) => setForm((current) => ({ ...current, gate: event.target.value }))}
                placeholder="A1"
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="primary-button" disabled={isSubmitting || loadingOperations}>
                {isSubmitting ? "Saving..." : editingFlightId ? "Update Flight" : "Create Flight"}
              </button>
              {editingFlightId ? (
                <button type="button" className="ghost-button dark-text" onClick={resetForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>

          {operationsError ? <p className="error-text">{operationsError}</p> : null}
        </SectionPanel>

        <SectionPanel
          title="Manage Existing Flights"
          description="Edit or remove current records directly from the admin dashboard."
        >
          {loadingOperations ? <p className="muted-text">Loading flight operations...</p> : null}
          {!loadingOperations ? (
            <div className="admin-flight-list">
              {flights.map((flight) => (
                <div key={flight.id} className="admin-flight-card">
                  <div className="admin-flight-copy">
                    <strong>{flight.flight_number}</strong>
                    <span>
                      {airportLabelById[flight.origin_airport] || flight.origin_code}
                      {" -> "}
                      {airportLabelById[flight.destination_airport] || flight.destination_code}
                    </span>
                    <span>{formatDateTime(flight.departure_time)}</span>
                    <span>
                      Aircraft: {aircraftLabelById[flight.aircraft] || flight.aircraft}
                    </span>
                  </div>

                  <div className="admin-flight-actions">
                    <button type="button" className="ghost-button dark-text" onClick={() => startEditing(flight)}>
                      Edit
                    </button>
                    <button type="button" className="danger-button" onClick={() => handleDelete(flight.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </SectionPanel>
      </section>
    </main>
  );
}
