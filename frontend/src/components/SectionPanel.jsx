export function SectionPanel({ title, description, children }) {
  return (
    <section className="page-panel">
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
