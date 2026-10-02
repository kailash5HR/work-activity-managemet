import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import MobileBar from "./MobileBar";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/activities", label: "My Activities" },
  { to: "/calendar", label: "Calendar" },
  { to: "/completed", label: "Completed" },
  { to: "/profile", label: "Profile" },
];

function AppShell({ children }) {
  const { logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Logo />
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button type="button" className="logout-button" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
        <NavLink to="/activities" className="floating-add" aria-label="Add activity">
          +
        </NavLink>
      </main>

      <MobileBar />
    </div>
  );
}

export default AppShell;