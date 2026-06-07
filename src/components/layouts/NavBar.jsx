import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  UserCheck,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import logo from "../../assets/pulselogowhite.png";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  console.log("User in Navbar:", user, user?.first_name, user?.last_name);
  const navigate = useNavigate();
  // console.log("User in Navbar:", user.first_name, user.last_name);

  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`;

  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`;

  return (
    <>
      <div className="fixed-top">
        {/* Top Header */}
        <header className="navbar-header pe-2">
          <div className="navbar-header__left">
            <img
              src={logo}
              alt="USM Pulse"
              className="navbar-logo"
              onClick={() => navigate("/attendance")}
            />
          </div>

          <div className="navbar-header__right">
            <div className="navbar-profile">
              <div className="navbar-avatar"> {initials}</div>

              <div className="navbar-user">
                <span className="navbar-user__name">{fullName}</span>
              </div>

              <ChevronDown size={18} />
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="navbar-menu">
          <NavLink
            to="/attendance"
            className={({ isActive }) =>
              isActive ? "navbar-link navbar-link--active" : "navbar-link"
            }
          >
            <LayoutDashboard size={18} />
            Attendance
          </NavLink>

          <NavLink
            to="/requests"
            className={({ isActive }) =>
              isActive ? "navbar-link navbar-link--active" : "navbar-link"
            }
          >
            <FileText size={18} />
            Request
          </NavLink>

          <NavLink
            to="/leaves"
            className={({ isActive }) =>
              isActive ? "navbar-link navbar-link--active" : "navbar-link"
            }
          >
            <UserCheck size={18} />
            Leaves
          </NavLink>

          <NavLink
            to="/holidays"
            className={({ isActive }) =>
              isActive ? "navbar-link navbar-link--active" : "navbar-link"
            }
          >
            <CalendarDays size={18} />
            Holidays List
          </NavLink>
        </nav>
      </div>
    </>
  );
}
