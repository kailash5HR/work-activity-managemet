import { useActivities } from "../context/useActivities";
import ProgressRing from "../components/ProgressRing";
import ActivityCard from "../components/ActivityCard";
function Dashboard() {
  const { activities } = useActivities();

  const total = activities.length;

  const completed = activities.filter(
    (activity) => activity.status === "completed"
  ).length;

  const pending = total - completed;

  const completionRate =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);
  const upcomingActivities = activities
  .filter((activity) => activity.status === "pending")
  .sort((a, b) => {
    return `${a.date} ${a.startTime}`
      .localeCompare(`${b.date} ${b.startTime}`);
  })
  .slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Good morning 👋</h1>
          <p>Here's what's happening with your day.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Activities</span>
          <strong>{total}</strong>
        </div>

        <div className="stat-card">
          <span>Completed</span>
          <strong>{completed}</strong>
        </div>

        <div className="stat-card">
          <span>Remaining</span>
          <strong>{pending}</strong>
        </div>

        <div className="stat-card">
          <span>Completion</span>
          <strong>{completionRate}%</strong>
        </div>
		<div className="dashboard-progress">
  <div>
    <h2>Today's Progress</h2>
    <p>Keep going. Small steps count.</p>
  </div>

  <ProgressRing percentage={completionRate} />
</div>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Upcoming Activities</h2>
        </div>

        {upcomingActivities.length === 0 ? (
          <div className="empty-state">
            <h3>You're all caught up!</h3>
            <p>No pending activities.</p>
          </div>
        ) : (
          upcomingActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={() => {}}
            />
          ))
        )}
      </section>
    </div>
  );
}

export default Dashboard;