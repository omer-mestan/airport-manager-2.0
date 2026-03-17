import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../auth";

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, isLoadingSession, profile, defaultRouteForRole } = useAuth();
  const location = useLocation();

  if (isLoadingSession) {
    return <section className="page-panel">Loading session...</section>;
  }

  if (!isAuthenticated || !profile) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(profile.role)) {
    return <Navigate to={defaultRouteForRole(profile.role)} replace />;
  }

  return children;
}
