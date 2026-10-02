import { useState } from "react";
import { useActivities } from "../context/useActivities";

function createInitialForm(activity) {
  return {
    title: activity?.title || "",
    description: activity?.description || "",
    date: activity?.date || new Date().toISOString().split("T")[0],
    startTime: activity?.startTime || "",
    endTime: activity?.endTime || "",
    reminder: activity?.reminder || false,
    priority: activity?.priority || "medium",
  };
}

function ActivityForm({ activity, onClose }) {
  const { addActivity, updateActivity } = useActivities();

  const [form, setForm] = useState(() => createInitialForm(activity));

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter an activity title.");
      return;
    }

    if (activity) {
      updateActivity(activity.id, form);
    } else {
      addActivity(form);
    }

    onClose();
  }

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <h2>
        {activity ? "Edit Activity" : "Add Activity"}
      </h2>

      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="What do you want to do?"
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add some details..."
        />
      </label>

      <label>
        Date
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
      </label>

      <div className="form-row">
        <label>
          Start Time
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />
        </label>

        <label>
          End Time
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
          />
        </label>
      </div>

      <label>
        Priority
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="reminder"
          checked={form.reminder}
          onChange={handleChange}
        />

        Enable reminder
      </label>

      <div className="form-actions">
        <button type="button" onClick={onClose}>
          Cancel
        </button>

        <button type="submit">
          {activity ? "Save Changes" : "Add Activity"}
        </button>
      </div>
    </form>
  );
}

export default ActivityForm;