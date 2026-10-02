import { Link } from "react-router-dom";

const features = [
  {
    title: "Smart planning",
    description: "Create focused routines for deep work, meetings, and personal tasks.",
  },
  {
    title: "Track progress",
    description: "Stay on top of priorities with instant status updates and completion insights.",
  },
  {
    title: "Stay consistent",
    description: "Build momentum with a clear daily view, reminders, and a consistent workflow.",
  },
];

function Landing() {
  return (
    <main className="landing-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Daily focus, done beautifully</span>
          <h1>Plan your workday and move forward with clarity.</h1>
          <p>
            Daily Activity helps you organize important tasks, track progress, and keep your day
            intentional from morning to closeout.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="primary-button">
              Get started
            </Link>
            <Link to="/login" className="secondary-button">
              Sign in
            </Link>
          </div>

          <div className="hero-metrics">
            <div>
              <strong>120+</strong>
              <span>Tasks planned</span>
            </div>
            <div>
              <strong>96%</strong>
              <span>Focus score</span>
            </div>
            <div>
              <strong>7 days</strong>
              <span>Clear routines</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Daily activity dashboard preview">
          <div className="mini-card large">
            <span>Today</span>
            <strong>Product sprint</strong>
            <small>4 tasks scheduled</small>
          </div>
          <div className="mini-card">
            <span>Completed</span>
            <strong>3/5</strong>
          </div>
          <div className="mini-card accent">
            <span>Focus block</span>
            <strong>9:00 AM</strong>
          </div>
        </div>
      </section>

      <section className="feature-grid" aria-label="Key features">
        {features.map((feature) => (
          <article key={feature.title} className="feature-card">
            <div className="feature-icon">✓</div>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Landing;
