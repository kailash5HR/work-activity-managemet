async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function loginUser(email, password) {
  const result = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return result;
}

export async function registerUser(name, email, password) {
  const result = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  return result;
}
