import { useEffect, useState } from "react";

import { getAdminDashboard } from "../api";
import { useAuth } from "../auth";
import { SectionPanel } from "../components/SectionPanel";
import { SummaryCard } from "../components/SummaryCard";
import { formatDateTime } from "../utils";

export function AdminDashboardPage() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

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

  return (
    <main className="page-grid">
      <section className="page-heading">
        <p className="eyebrow navy">Admin Dashboard</p>
        <h1>Operations Overview</h1>
        <p className="page-copy">
          Protected summary data for flight operations, delay monitoring, and system status.
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
    </main>
  );
}
