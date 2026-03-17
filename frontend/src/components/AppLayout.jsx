import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../auth";
import { formatRole } from "../utils";

function navClassName({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

export function AppLayout() {
  const { profile, signOut } = useAuth();

  return (
    <div className="app-frame">
      <header className="site-header">
        <div className="brand-block">
          <p className="brand-kicker">Airport Ops</p>
          <NavLink to="/" className="brand-name">
            Airport Manager 2.0
          </NavLink>
        </div>

        <nav className="site-nav">
          <NavLink to="/" className={navClassName}>
            Home
          </NavLink>
          <NavLink to="/flights" className={navClassName}>
            Flights
          </NavLink>
          <NavLink to="/dashboard/admin" className={navClassName}>
            Admin
          </NavLink>
          <NavLink to="/dashboard/crew" className={navClassName}>
            Crew
          </NavLink>
        </nav>

        <div className="session-actions">
          {profile ? (
            <>
              <div className="profile-badge">
                <strong>{profile.full_name}</strong>
                <span>{formatRole(profile.role)}</span>
              </div>
              <button type="button" className="ghost-button" onClick={signOut}>
                Sign Out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="login-link">
              Sign In
            </NavLink>
          )}
        </div>
      </header>

      <Outlet />
    </div>
  );
}
