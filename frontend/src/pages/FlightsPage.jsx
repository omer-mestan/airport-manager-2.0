import { useEffect, useState } from "react";

import { getFlights } from "../api";
import { FlightsTable } from "../components/FlightsTable";
import { SectionPanel } from "../components/SectionPanel";
import { SummaryCard } from "../components/SummaryCard";

export function FlightsPage() {
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
      <section className="page-heading">
        <p className="eyebrow navy">Passenger View</p>
        <h1>Flight Board</h1>
        <p className="page-copy">
          Public passengers can browse current departures and arrivals without signing in.
        </p>
      </section>

      <div className="summary-grid">
        <SummaryCard label="Visible Flights" value={flights.length} accent="blue" />
        <SummaryCard
          label="Delayed"
          value={flights.filter((flight) => flight.status === "DELAYED").length}
          accent="amber"
        />
        <SummaryCard
          label="On Time"
          value={flights.filter((flight) => flight.status === "ON_TIME").length}
          accent="green"
        />
        <SummaryCard
          label="Scheduled"
          value={flights.filter((flight) => flight.status === "SCHEDULED").length}
          accent="rose"
        />
      </div>

      <SectionPanel
        title="All Flights"
        description="This page is the natural base for adding filters, search, and details pages next."
      >
        {loadingFlights ? <p className="muted-text">Loading flights...</p> : null}
        {flightError ? <p className="error-text">{flightError}</p> : null}
        {!loadingFlights && !flightError ? <FlightsTable flights={flights} /> : null}
      </SectionPanel>
    </main>
  );
}
