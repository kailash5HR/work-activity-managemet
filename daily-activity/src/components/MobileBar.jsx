import { NavLink } from "react-router-dom";

function MobileBar() {
  return (
    <nav className="mobile-bar" aria-label="Mobile navigation">
      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
      <NavLink to="/activities" className={({ isActive }) => (isActive ? "active" : "")}>Activities</NavLink>
      <NavLink to="/calendar" className={({ isActive }) => (isActive ? "active" : "")}>Calendar</NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>Profile</NavLink>
    </nav>
  );
}

export default MobileBar;