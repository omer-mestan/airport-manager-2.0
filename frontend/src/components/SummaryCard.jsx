export function SummaryCard({ label, value, accent = "blue" }) {
  return (
    <article className={`summary-card ${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
