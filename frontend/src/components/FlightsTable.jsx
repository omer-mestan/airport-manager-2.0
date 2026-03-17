import { Link } from "react-router-dom";

import { formatDateTime, statusTone } from "../utils";

export function FlightsTable({ flights }) {
  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>
            <th>Flight</th>
            <th>Route</th>
            <th>Departure</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.id}>
              <td>
                <Link to={`/flights/${flight.id}`} className="table-link">
                  <strong>{flight.flight_number}</strong>
                </Link>
                <span>{flight.airline_name}</span>
              </td>
              <td>
                <strong>{flight.origin_code} {"->"} {flight.destination_code}</strong>
                <span>Gate {flight.gate || "TBD"}</span>
              </td>
              <td>{formatDateTime(flight.departure_time)}</td>
              <td>
                <span className={`status-pill ${statusTone[flight.status] || "scheduled"}`}>
                  {flight.status.replaceAll("_", " ")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
