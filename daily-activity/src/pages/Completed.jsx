import { useActivities } from "../context/useActivities";
import ActivityCard from "../components/ActivityCard";

function Completed() {
  const { activities } = useActivities();

  const completedActivities = activities.filter(
    (activity) => activity.status === "completed"
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Completed</h1>
          <p>Look back at what you've accomplished.</p>
        </div>
      </div>

      {completedActivities.length === 0 ? (
        <div className="empty-state">
          <h2>No completed activities</h2>
          <p>
            Complete an activity and it will appear here.
          </p>
        </div>
      ) : (
        completedActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onEdit={() => {}}
          />
        ))
      )}
    </div>
  );
}

export default Completed;