import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getFlights } from "../api";
import { FlightsTable } from "../components/FlightsTable";
import { SectionPanel } from "../components/SectionPanel";
import { SummaryCard } from "../components/SummaryCard";

export function HomePage() {
  const [flights, setFlights] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(true);
  const [flightError, setFlightError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadFlights() {
      try {
        setLoadingFlights(true);
        const data = await getFlights();
        if (isActive) {
          setFlights(data.results || []);
          setFlightError("");
        }
      } catch (error) {
        if (isActive) {
          setFlightError(error.message);
        }
      } finally {
        if (isActive) {
          setLoadingFlights(false);
        }
      }
    }

    loadFlights();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="page-grid">
      <section className="hero hero-expanded">
        <div className="hero-copy">
          <p className="eyebrow">Full-Stack Portfolio</p>
          <h1>Route passengers, crew, and ops through one product.</h1>
          <p className="lead">
            Airport Manager 2.0 now has separate routes, protected dashboards, and a frontend structure
            that can grow into a real internship-grade application.
          </p>
          <div className="hero-actions">
            <Link to="/flights">Open Flight Board</Link>
            <Link to="/login" className="secondary">
              Demo Login
            </Link>
          </div>
        </div>

        <aside className="hero-card metrics-card">
          <h2>Snapshot</h2>
          <div className="summary-grid compact">
            <SummaryCard label="Flights" value={flights.length} accent="blue" />
            <SummaryCard
              label="Delayed"
              value={flights.filter((flight) => flight.status === "DELAYED").length}
              accent="amber"
            />
            <SummaryCard
              label="Boarding"
              value={flights.filter((flight) => flight.status === "BOARDING").length}
              accent="green"
            />
          </div>
        </aside>
      </section>

      <SectionPanel
        title="Live Flight Preview"
        description="Public data from the Django REST backend, ready for a richer passenger-facing board."
      >
        {loadingFlights ? <p className="muted-text">Loading flights...</p> : null}
        {flightError ? <p className="error-text">{flightError}</p> : null}
        {!loadingFlights && !flightError ? <FlightsTable flights={flights.slice(0, 5)} /> : null}
      </SectionPanel>

      <section className="two-column-grid">
        <SectionPanel
          title="Built For Portfolio Impact"
          description="The current setup is already strong enough to explain in an internship interview."
        >
          <div className="bullet-grid">
            <div className="feature-card">
              <strong>Role-based access</strong>
              <span>Admin and crew routes are protected and tied to backend permissions.</span>
            </div>
            <div className="feature-card">
              <strong>Connected stack</strong>
              <span>React talks to Django through a Vite proxy, which keeps local development simple.</span>
            </div>
            <div className="feature-card">
              <strong>Demo-friendly</strong>
              <span>Seeded accounts and data make it easy to show the product without setup friction.</span>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel title="Quick Access" description="Use these next while you keep building.">
          <div className="quick-links">
            <a href="http://127.0.0.1:8000/api/docs/" target="_blank" rel="noreferrer">Swagger Docs</a>
            <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer">Django Admin</a>
            <Link to="/dashboard/admin">Admin Dashboard</Link>
            <Link to="/dashboard/crew">Crew Dashboard</Link>
          </div>
        </SectionPanel>
      </section>
    </main>
  );
}
