import { useAuth } from "../context/AuthContext";
import { useActivities } from "../context/useActivities";

function getPriorityValue(priority) {
  return { high: 3, medium: 2, low: 1 }[priority] ?? 0;
}

function Profile() {
  const { user } = useAuth();
  const { activities = [] } = useActivities();

  const pendingActivities = activities.filter((activity) => activity.status !== "completed");
  const completeCount = activities.filter((activity) => activity.status === "completed").length;

  const priorityCounts = pendingActivities.reduce(
    (counts, activity) => {
      counts[activity.priority || "medium"] += 1;
      return counts;
    },
    { high: 0, medium: 0, low: 0 }
  );

  const topPriority = Object.entries(priorityCounts).sort(
    (a, b) => getPriorityValue(b[0]) - getPriorityValue(a[0])
  )[0]?.[0] || "medium";

  const focusMode =
    priorityCounts.high > 0 ? "Deep work" :
    pendingActivities.length > 3 ? "Sprint mode" :
    "Balanced flow";

  const weeklyGoal = Math.max(5, Math.min(15, activities.length + 3));

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "DA";

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Manage your Daily Activity profile.</p>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">{initials}</div>
        <div>
          <h2>{user?.name || "Daily Activity User"}</h2>
          <p>{user?.email || "user@example.com"}</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="info-card">
          <span>Focus mode</span>
          <strong>{focusMode}</strong>
        </div>
        <div className="info-card">
          <span>Top priority</span>
          <strong>{topPriority}</strong>
        </div>
        <div className="info-card">
          <span>Weekly goal</span>
          <strong>{weeklyGoal} tasks</strong>
        </div>
        <div className="info-card">
          <span>Completed</span>
          <strong>{completeCount} tasks</strong>
        </div>
      </div>
    </div>
  );
}

export default Profile;