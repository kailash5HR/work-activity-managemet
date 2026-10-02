import { useEffect, useState } from "react";

import { useAuth } from "./AuthContext";
import { ActivityContext } from "./activityContext";
import {
  createActivity,
  deleteActivityById,
  fetchActivities,
  updateActivityById,
} from "../services/activityService";

export function ActivityProvider({ children }) {
  const { user, token } = useAuth();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!user) {
      setActivities([]);
      return;
    }

    async function loadActivities() {
      const result = await fetchActivities(user.id, token);

      if (result.success) {
        setActivities(result.activities);
      } else {
        setActivities([]);
      }
    }

    loadActivities();
  }, [user?.id, token]);

  async function addActivity(activity) {
    if (!user) {
      return { success: false, message: "Please log in to add activities." };
    }

    const result = await createActivity(user.id, activity, token);

    if (result.success) {
      setActivities((current) => [result.activity, ...current]);
    }

    return result;
  }

  async function updateActivity(id, updatedData) {
    if (!user) {
      return { success: false, message: "Please log in to update activities." };
    }

    const result = await updateActivityById(id, user.id, updatedData, token);

    if (result.success) {
      setActivities((current) =>
        current.map((activity) =>
          activity.id === id ? result.activity : activity
        )
      );
    }

    return result;
  }

  async function deleteActivity(id) {
    if (!user) {
      return { success: false, message: "Please log in to delete activities." };
    }

    const result = await deleteActivityById(id, user.id, token);

    if (result.success) {
      setActivities((current) =>
        current.filter((activity) => activity.id !== id)
      );
    }

    return result;
  }

  function completeActivity(id) {
    return updateActivity(id, { status: "completed" });
  }

  function restoreActivity(id) {
    return updateActivity(id, { status: "pending" });
  }

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        completeActivity,
        restoreActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

