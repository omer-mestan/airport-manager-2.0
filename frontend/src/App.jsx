import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./auth";
import { AppLayout } from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { CrewDashboardPage } from "./pages/CrewDashboardPage";
import { FlightDetailsPage } from "./pages/FlightDetailsPage";
import { FlightsPage } from "./pages/FlightsPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function DashboardRedirect() {
  const { profile, isAuthenticated, isLoadingSession, defaultRouteForRole } = useAuth();

  if (isLoadingSession) {
    return <section className="page-panel">Loading dashboard...</section>;
  }

  if (!isAuthenticated || !profile) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={defaultRouteForRole(profile.role)} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="/flights/:flightId" element={<FlightDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/crew"
              element={
                <ProtectedRoute roles={["ADMIN", "CREW_MEMBER"]}>
                  <CrewDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
