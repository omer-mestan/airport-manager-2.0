import { useEffect, useMemo, useState } from "react";

import { getFlightsWithQuery } from "../api";
import { FlightsTable } from "../components/FlightsTable";
import { SectionPanel } from "../components/SectionPanel";
import { SummaryCard } from "../components/SummaryCard";

const STATUS_FILTERS = ["", "SCHEDULED", "BOARDING", "ON_TIME", "DELAYED", "CANCELLED"];

export function FlightsPage() {
  const [flights, setFlights] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(true);
  const [flightError, setFlightError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  useEffect(() => {
    let isActive = true;

    async function loadFlights() {
      try {
        setLoadingFlights(true);
        const data = await getFlightsWithQuery({
          search: filters.search.trim(),
          status: filters.status,
        });
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
  }, [filters]);

  const delayedFlights = useMemo(
    () => flights.filter((flight) => flight.status === "DELAYED").length,
    [flights],
  );

  const onTimeFlights = useMemo(
    () => flights.filter((flight) => flight.status === "ON_TIME").length,
    [flights],
  );

  const scheduledFlights = useMemo(
    () => flights.filter((flight) => flight.status === "SCHEDULED").length,
    [flights],
  );

  return (
    <main className="page-grid">
      <section className="page-heading">
        <p className="eyebrow navy">Passenger View</p>
        <h1>Flight Board</h1>
        <p className="page-copy">
          Search by flight number or route and filter the board by current status.
        </p>
      </section>

      <div className="summary-grid">
        <SummaryCard label="Visible Flights" value={flights.length} accent="blue" />
        <SummaryCard label="Delayed" value={delayedFlights} accent="amber" />
        <SummaryCard label="On Time" value={onTimeFlights} accent="green" />
        <SummaryCard label="Scheduled" value={scheduledFlights} accent="rose" />
      </div>

      <SectionPanel
        title="Search And Filter"
        description="This view now behaves more like a real passenger-facing flight board."
      >
        <div className="filter-bar">
          <label>
            Search
            <input
              value={filters.search}
              onChange={(event) =>
                setFilters((current) => ({ ...current, search: event.target.value }))
              }
              placeholder="Flight number, airline, SOF, FRA..."
            />
          </label>

          <label>
            Status
            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((current) => ({ ...current, status: event.target.value }))
              }
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status || "all"} value={status}>
                  {status ? status.replaceAll("_", " ") : "All statuses"}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="ghost-button dark-text"
            onClick={() => setFilters({ search: "", status: "" })}
          >
            Reset
          </button>
        </div>
      </SectionPanel>

      <SectionPanel
        title="All Flights"
        description="Click a flight number to open a details page for that route."
      >
        {loadingFlights ? <p className="muted-text">Loading flights...</p> : null}
        {flightError ? <p className="error-text">{flightError}</p> : null}
        {!loadingFlights && !flightError ? <FlightsTable flights={flights} /> : null}
      </SectionPanel>
    </main>
  );
}
