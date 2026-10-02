import { useActivities } from "../context/useActivities";

function ActivityCard({ activity, onEdit }) {
  const {
    completeActivity,
    restoreActivity,
    deleteActivity,
  } = useActivities();

  return (
    <div className={`activity-card priority-${activity.priority}`}>
      <div className="activity-card-left">
        <button
          className="activity-check"
          onClick={() =>
            activity.status === "completed"
              ? restoreActivity(activity.id)
              : completeActivity(activity.id)
          }
        >
          {activity.status === "completed" ? "✓" : ""}
        </button>

        <div className="activity-info">
          <h3
            className={
              activity.status === "completed"
                ? "activity-completed"
                : ""
            }
          >
            {activity.title}
          </h3>

          {activity.description && (
            <p>{activity.description}</p>
          )}

          <div className="activity-meta">
            <span>{activity.date}</span>

            {activity.startTime && (
              <span>
                {activity.startTime}
                {activity.endTime &&
                  ` - ${activity.endTime}`}
              </span>
            )}

            <span className={`priority priority-${activity.priority}`}>
              {activity.priority}
            </span>
          </div>
        </div>
      </div>

      <div className="activity-actions">
        <button onClick={() => onEdit(activity)}>
          Edit
        </button>

        <button onClick={() => deleteActivity(activity.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default ActivityCard;