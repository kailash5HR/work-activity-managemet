import { useMemo, useState } from "react";

import { useActivities } from "../context/useActivities";

function CalendarPage() {
  const { activities } = useActivities();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const shortlisted = useMemo(
    () =>
      activities.filter((activity) => activity.date === selectedDate).sort((a, b) => {
        const aTime = `${a.date} ${a.startTime || "00:00"}`;
        const bTime = `${b.date} ${b.startTime || "00:00"}`;
        return aTime.localeCompare(bTime);
      }),
    [activities, selectedDate]
  );

  const formattedDate = new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Calendar</h1>
          <p>View your activities by date.</p>
        </div>
      </div>

      <div className="calendar-container">
        <label className="calendar-picker-label">
          Selected date
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </label>

        <div className="calendar-day">
          <h2>{formattedDate}</h2>

          {shortlisted.length === 0 ? (
            <div className="empty-state compact">
              <h3>No activities for this day</h3>
              <p>Plan a new focus block and it will appear here.</p>
            </div>
          ) : (
            shortlisted.map((activity) => (
              <div key={activity.id} className={`calendar-event priority-${activity.priority}`}>
                <div>
                  <strong>{activity.title}</strong>
                  <p>
                    {activity.startTime || "All day"}
                    {activity.endTime ? ` - ${activity.endTime}` : ""}
                  </p>
                </div>
                <span>{activity.priority}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;