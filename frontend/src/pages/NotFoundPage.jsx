import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="auth-page">
      <section className="auth-card not-found-card">
        <p className="eyebrow navy">404</p>
        <h1>That route is not on the board.</h1>
        <p className="page-copy">Head back to the dashboard home and keep building.</p>
        <Link to="/" className="inline-link-button">
          Back Home
        </Link>
      </section>
    </main>
  );
}
