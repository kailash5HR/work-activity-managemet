import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const SESSION_KEY = "daily-activity::session";

function readStoredSession() {
  try {
    const value = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!value || !value.user) {
      return null;
    }

    return {
      user: value.user,
      token: value.token || null,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [session]);

  const user = session?.user ?? null;
  const token = session?.token ?? null;

  const value = useMemo(
    () => ({
      user,
      token,
      login: async ({ email, password }) => {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: data.message || "Invalid email or password.",
          };
        }

        setSession({ user: data.user, token: data.token || null });
        return { success: true, user: data.user, token: data.token || null };
      },
      register: async ({ name, email, password }) => {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: data.message || "Unable to create account.",
          };
        }

        setSession({ user: data.user, token: data.token || null });
        return { success: true, user: data.user, token: data.token || null };
      },
      logout: () => setSession(null),
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
