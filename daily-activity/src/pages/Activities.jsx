import { useState } from "react";
import { useActivities } from "../context/useActivities";
import ActivityCard from "../components/ActivityCard";
import ActivityForm from "../components/ActivityForm";

function Activities() {
  const { activities } = useActivities();

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  function handleEdit(activity) {
    setEditingActivity(activity);
    setShowForm(true);
  }

  function handleClose() {
    setShowForm(false);
    setEditingActivity(null);
  }

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPriority =
      priorityFilter === "all" || activity.priority === priorityFilter;

    const matchesStatus =
      statusFilter === "all" || activity.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Activities</h1>
          <p>Plan and manage your daily activities.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          + Add Activity
        </button>
      </div>

      <div className="activity-filters">
        <input
          type="text"
          placeholder="Search activities..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {activities.length === 0 ? (
        <div className="empty-state">
          <h2>No activities yet</h2>
          <p>
            Add your first activity to start planning your day.
          </p>

          <button
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            Add Activity
          </button>
        </div>
      ) : (
        <div>
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={handleEdit}
              />
            ))
          ) : (
            <div className="empty-state">
              <h2>No matching activities</h2>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="modal-close"
              onClick={handleClose}
            >
              ×
            </button>

            <ActivityForm
              key={editingActivity?.id || "new"}
              activity={editingActivity}
              onClose={handleClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Activities;