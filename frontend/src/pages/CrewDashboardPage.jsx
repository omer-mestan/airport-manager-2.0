import { useEffect, useState } from "react";

import { getCrewDashboard } from "../api";
import { useAuth } from "../auth";
import { SectionPanel } from "../components/SectionPanel";
import { SummaryCard } from "../components/SummaryCard";
import { formatDateTime } from "../utils";

export function CrewDashboardPage() {
  const { token, profile } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      try {
        setLoadingDashboard(true);
        const data = await getCrewDashboard(token);
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
        <p className="eyebrow navy">Crew Dashboard</p>
        <h1>{profile?.full_name || "Crew Member"}</h1>
        <p className="page-copy">
          Upcoming assignments, next flight visibility, and a solid base for roster management.
        </p>
      </section>

      {loadingDashboard ? <section className="page-panel">Loading dashboard...</section> : null}
      {dashboardError ? <section className="page-panel error-text">{dashboardError}</section> : null}

      {dashboard ? (
        <>
          <div className="summary-grid">
            <SummaryCard label="Assignments" value={dashboard.total_assignments} accent="blue" />
            <SummaryCard label="Upcoming" value={dashboard.upcoming_assignments} accent="green" />
          </div>

          <section className="two-column-grid">
            <SectionPanel
              title="Next Flight"
              description="The nearest assignment visible from the protected crew API."
            >
              {dashboard.next_flight ? (
                <div className="hero-mini-card">
                  <strong>{dashboard.next_flight.flight_number}</strong>
                  <span>{dashboard.next_flight.origin} {"->"} {dashboard.next_flight.destination}</span>
                  <span>{dashboard.next_flight.status.replaceAll("_", " ")}</span>
                  <span>{formatDateTime(dashboard.next_flight.departure_time)}</span>
                </div>
              ) : (
                <p className="muted-text">No upcoming flights yet.</p>
              )}
            </SectionPanel>

            <SectionPanel
              title="Assignment Feed"
              description="A clean place to extend later with checklists and crew notes."
            >
              <div className="list-card">
                {dashboard.assignments.map((assignment) => (
                  <div key={`${assignment.flight_number}-${assignment.departure_time}`} className="list-row">
                    <div>
                      <strong>{assignment.flight_number}</strong>
                      <span>{assignment.origin} {"->"} {assignment.destination}</span>
                    </div>
                    <div>
                      <strong>{assignment.duty_role}</strong>
                      <span>{formatDateTime(assignment.departure_time)}</span>
                    </div>
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
