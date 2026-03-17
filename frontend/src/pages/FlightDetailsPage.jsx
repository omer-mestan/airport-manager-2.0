import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getFlightById } from "../api";
import { SectionPanel } from "../components/SectionPanel";
import { formatDateTime, statusTone } from "../utils";

export function FlightDetailsPage() {
  const { flightId } = useParams();
  const [flight, setFlight] = useState(null);
  const [loadingFlight, setLoadingFlight] = useState(true);
  const [flightError, setFlightError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadFlight() {
      try {
        setLoadingFlight(true);
        const data = await getFlightById(flightId);
        if (isActive) {
          setFlight(data);
          setFlightError("");
        }
      } catch (error) {
        if (isActive) {
          setFlightError(error.message);
        }
      } finally {
        if (isActive) {
          setLoadingFlight(false);
        }
      }
    }

    loadFlight();
    return () => {
      isActive = false;
    };
  }, [flightId]);

  return (
    <main className="page-grid">
      <section className="page-heading">
        <p className="eyebrow navy">Flight Details</p>
        <h1>{flight ? flight.flight_number : "Flight"}</h1>
        <p className="page-copy">
          A dedicated route for a single flight, ready for future passenger and crew features.
        </p>
      </section>

      {loadingFlight ? <section className="page-panel">Loading flight details...</section> : null}
      {flightError ? <section className="page-panel error-text">{flightError}</section> : null}

      {flight ? (
        <>
          <section className="details-hero">
            <div className="details-route-card">
              <div>
                <p className="eyebrow navy">Route</p>
                <h2>{flight.origin_code} {"->"} {flight.destination_code}</h2>
                <p className="page-copy">{flight.airline_name}</p>
              </div>
              <span className={`status-pill ${statusTone[flight.status] || "scheduled"}`}>
                {flight.status.replaceAll("_", " ")}
              </span>
            </div>
          </section>

          <section className="two-column-grid">
            <SectionPanel title="Schedule" description="Core timing and gate information.">
              <div className="detail-grid">
                <div className="detail-item">
                  <span>Departure</span>
                  <strong>{formatDateTime(flight.departure_time)}</strong>
                </div>
                <div className="detail-item">
                  <span>Arrival</span>
                  <strong>{formatDateTime(flight.arrival_time)}</strong>
                </div>
                <div className="detail-item">
                  <span>Gate</span>
                  <strong>{flight.gate || "TBD"}</strong>
                </div>
              </div>
            </SectionPanel>

            <SectionPanel title="Crew Assignments" description="Visible assignment data from the backend.">
              <div className="list-card">
                {flight.crew_assignments.length ? (
                  flight.crew_assignments.map((assignment) => (
                    <div key={assignment.id} className="list-row">
                      <div>
                        <strong>{assignment.crew_member_name}</strong>
                        <span>{assignment.crew_member_email}</span>
                      </div>
                      <div>
                        <strong>{assignment.duty_role}</strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="muted-text">No crew assignments yet.</p>
                )}
              </div>
            </SectionPanel>
          </section>

          <Link to="/flights" className="inline-link-button">
            Back to Flight Board
          </Link>
        </>
      ) : null}
    </main>
  );
}
