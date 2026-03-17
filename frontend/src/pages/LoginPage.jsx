import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../auth";
import { demoAccounts } from "../utils";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, profile, signIn, authError, defaultRouteForRole, isLoadingSession } = useAuth();
  const [credentials, setCredentials] = useState({
    email: demoAccounts[0].email,
    password: demoAccounts[0].password,
  });
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated && profile) {
    return <Navigate to={defaultRouteForRole(profile.role)} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLocalError("");
      setIsSubmitting(true);
      const result = await signIn(credentials.email, credentials.password);
      navigate(location.state?.from || defaultRouteForRole(result.profile.role), { replace: true });
    } catch (error) {
      setLocalError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-copy">
          <p className="eyebrow navy">Secure Access</p>
          <h1>Sign in to a role dashboard.</h1>
          <p className="page-copy">
            Use one of the seeded demo accounts to preview protected routes and backend-driven data.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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
          <button type="submit" disabled={isSubmitting || isLoadingSession}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="demo-account-grid">
          {demoAccounts.map((account) => (
            <button
              key={account.role}
              type="button"
              className="demo-account-card"
              onClick={() => setCredentials({ email: account.email, password: account.password })}
            >
              <strong>{account.role}</strong>
              <span>{account.email}</span>
            </button>
          ))}
        </div>

        {localError || authError ? <p className="error-text">{localError || authError}</p> : null}
      </section>
    </main>
  );
}
