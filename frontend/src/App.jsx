import { useEffect, useState } from "react";

import { getAdminDashboard, getCrewDashboard, getFlights, getProfile, login } from "./api";

const demoAccounts = [
  { role: "Admin", email: "admin@airportmanager.dev", password: "admin12345" },
  { role: "Crew", email: "crew@airportmanager.dev", password: "crew12345" },
  { role: "Passenger", email: "passenger@airportmanager.dev", password: "passenger12345" },
];

const statusTone = {
  BOARDING: "boarding",
  DELAYED: "delayed",
  CANCELLED: "cancelled",
  ON_TIME: "on-time",
  SCHEDULED: "scheduled",
};

function formatDateTime(value) {
  if (!value) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function SummaryCard({ label, value, accent = "blue" }) {
  return (
    <article className={`summary-card ${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function FlightsTable({ flights }) {
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
                <strong>{flight.flight_number}</strong>
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

function DashboardPanel({ title, description, children }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function App() {
  const [flights, setFlights] = useState([]);
  const [flightError, setFlightError] = useState("");
  const [loadingFlights, setLoadingFlights] = useState(true);

  const [credentials, setCredentials] = useState({
    email: demoAccounts[0].email,
    password: demoAccounts[0].password,
  });
  const [token, setToken] = useState(() => localStorage.getItem("airport_manager_token") || "");
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [authError, setAuthError] = useState("");
  const [loadingDashboard, setLoadingDashboard] = useState(false);

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

  useEffect(() => {
    let isActive = true;

    async function loadSession() {
      if (!token) {
        setProfile(null);
        setDashboard(null);
        return;
      }

      try {
        setLoadingDashboard(true);
        const me = await getProfile(token);
        const dashboardData =
          me.role === "ADMIN" ? await getAdminDashboard(token) :
          me.role === "CREW_MEMBER" ? await getCrewDashboard(token) :
          null;

        if (isActive) {
          setProfile(me);
          setDashboard(dashboardData);
          setAuthError("");
        }
      } catch (error) {
        if (isActive) {
          setAuthError(error.message);
          setToken("");
          localStorage.removeItem("airport_manager_token");
          setProfile(null);
          setDashboard(null);
        }
      } finally {
        if (isActive) {
          setLoadingDashboard(false);
        }
      }
    }

    loadSession();
    return () => {
      isActive = false;
    };
  }, [token]);

  async function handleLogin(event) {
    event.preventDefault();
    try {
      setAuthError("");
      const data = await login(credentials.email, credentials.password);
      setToken(data.access);
      localStorage.setItem("airport_manager_token", data.access);
    } catch (error) {
      setAuthError(error.message);
    }
  }

  function handleLogout() {
    setToken("");
    setProfile(null);
    setDashboard(null);
    localStorage.removeItem("airport_manager_token");
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Internship Portfolio Project</p>
          <h1>Airport Manager 2.0</h1>
          <p className="lead">
            A full-stack flight operations platform with a public flight board, role-based dashboards,
            and a Django REST backend ready for React expansion.
          </p>
          <div className="hero-actions">
            <a href="http://127.0.0.1:8000/api/docs/" target="_blank" rel="noreferrer">Open API Docs</a>
            <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer" className="secondary">
              Open Admin
            </a>
          </div>
        </div>

        <aside className="hero-card">
          <h2>Demo Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <label>
              Email
              <input
                type="email"
                value={credentials.email}
                onChange={(event) =>
                  setCredentials((current) => ({ ...current, email: event.target.value }))
                }
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials((current) => ({ ...current, password: event.target.value }))
                }
              />
            </label>
            <button type="submit">Sign In</button>
          </form>

          <div className="demo-list">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                type="button"
                className="demo-chip"
                onClick={() => setCredentials({ email: account.email, password: account.password })}
              >
                {account.role}
              </button>
            ))}
          </div>

          {authError ? <p className="error-text">{authError}</p> : null}
          {profile ? (
            <div className="session-box">
              <strong>{profile.full_name}</strong>
              <span>{profile.role.replaceAll("_", " ")}</span>
              <button type="button" className="ghost-button" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          ) : null}
        </aside>
      </header>

      <main className="content-grid">
        <DashboardPanel
          title="Public Flight Board"
          description="The frontend reads live data from the Django REST API through the Vite dev proxy."
        >
          {loadingFlights ? <p className="muted-text">Loading flights...</p> : null}
          {flightError ? <p className="error-text">{flightError}</p> : null}
          {!loadingFlights && !flightError ? <FlightsTable flights={flights} /> : null}
        </DashboardPanel>

        <DashboardPanel
          title="System Snapshot"
          description="These cards are designed to become the visual base for the final dashboards."
        >
          <div className="summary-grid">
            <SummaryCard label="Visible Flights" value={flights.length} accent="blue" />
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
        </DashboardPanel>

        <DashboardPanel
          title="Role Dashboard Preview"
          description="Sign in with a demo account to load protected dashboard data from the backend."
        >
          {loadingDashboard ? <p className="muted-text">Loading dashboard...</p> : null}
          {!profile && !loadingDashboard ? (
            <p className="muted-text">Use one of the demo accounts to preview role-based data.</p>
          ) : null}

          {profile?.role === "ADMIN" && dashboard ? (
            <div className="stacked-layout">
              <div className="summary-grid">
                <SummaryCard label="Total Flights" value={dashboard.total_flights} accent="blue" />
                <SummaryCard label="Delayed" value={dashboard.delayed_flights} accent="amber" />
                <SummaryCard label="Cancelled" value={dashboard.cancelled_flights} accent="rose" />
                <SummaryCard label="Crew Members" value={dashboard.total_crew_members} accent="green" />
              </div>

              <div className="mini-grid">
                <div className="mini-card">
                  <h3>Upcoming Flights</h3>
                  <ul>
                    {dashboard.upcoming_flights.map((flight) => (
                      <li key={flight.flight_number}>
                        <strong>{flight.flight_number}</strong>
                        <span>{flight.origin} {"->"} {flight.destination}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mini-card">
                  <h3>Flights By Status</h3>
                  <ul>
                    {dashboard.flights_by_status.map((item) => (
                      <li key={item.status}>
                        <strong>{item.status.replaceAll("_", " ")}</strong>
                        <span>{item.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}

          {profile?.role === "CREW_MEMBER" && dashboard ? (
            <div className="stacked-layout">
              <div className="summary-grid">
                <SummaryCard label="Assignments" value={dashboard.total_assignments} accent="blue" />
                <SummaryCard label="Upcoming" value={dashboard.upcoming_assignments} accent="green" />
              </div>

              <div className="mini-card">
                <h3>Next Flight</h3>
                {dashboard.next_flight ? (
                  <div className="next-flight">
                    <strong>{dashboard.next_flight.flight_number}</strong>
                      <span>{dashboard.next_flight.origin} {"->"} {dashboard.next_flight.destination}</span>
                    <span>{formatDateTime(dashboard.next_flight.departure_time)}</span>
                  </div>
                ) : (
                  <p className="muted-text">No upcoming flights yet.</p>
                )}
              </div>
            </div>
          ) : null}

          {profile?.role === "PASSENGER" ? (
            <p className="muted-text">
              Passenger accounts can browse flights publicly. Protected dashboards are available for crew and admin roles.
            </p>
          ) : null}
        </DashboardPanel>
      </main>
    </div>
  );
}
