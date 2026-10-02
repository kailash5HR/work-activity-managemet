async function request(path, options = {}) {
  const { token, ...restOptions } = options;

  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(restOptions.headers || {}),
    },
    ...restOptions,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function fetchActivities(userId, token) {
  const result = await request(`/api/activities?userId=${encodeURIComponent(userId)}`, { token });

  if (!result.ok) {
    return {
      success: false,
      message: result.data.message || "Unable to load activities.",
      activities: [],
    };
  }

  return {
    success: true,
    activities: result.data.activities || [],
  };
}

export async function createActivity(userId, activity, token) {
  const result = await request("/api/activities", {
    method: "POST",
    body: JSON.stringify({ userId, ...activity }),
    token,
  });

  if (!result.ok) {
    return {
      success: false,
      message: result.data.message || "Unable to create activity.",
    };
  }

  return {
    success: true,
    activity: result.data.activity,
  };
}

export async function updateActivityById(id, userId, updatedData, token) {
  const result = await request(`/api/activities/${id}?userId=${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: JSON.stringify({ userId, ...updatedData }),
    token,
  });

  if (!result.ok) {
    return {
      success: false,
      message: result.data.message || "Unable to update activity.",
    };
  }

  return {
    success: true,
    activity: result.data.activity,
  };
}

export async function deleteActivityById(id, userId, token) {
  const result = await request(`/api/activities/${id}?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
    token,
  });

  if (!result.ok) {
    return {
      success: false,
      message: result.data.message || "Unable to delete activity.",
    };
  }

  return { success: true };
}
