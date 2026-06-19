import { NavLink, useNavigate,useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  UserCheck,
  CalendarDays,
  ChevronDown,
 User,
  LogOut,
} from "lucide-react";



import logo from "../../assets/pulselogowhite.png";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";



export default function Navbar() {

const location = useLocation();

const [showDropdown, setShowDropdown] = useState(false);

const toggleDropdown = () => {
  setShowDropdown((prev) => !prev);
};

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
              onClick={() => navigate("/HomePage")}
            />
          </div>

          <div className="navbar-header__right"  >
            <div className="navbar-profile" onClick={toggleDropdown} >
        
              <div className="navbar-avatar"> {initials}</div>

              <div className="navbar-user">
                <span className="navbar-user__name">{fullName}</span>
              </div>

              <ChevronDown size={18}  />

{showDropdown && (
      <div className="navbar-dropdown">
        <div
          className="navbar-dropdown__item"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/ProfilePage");
            setShowDropdown(false);

          }}
        >
       <User size={18} />  Profile
        </div>

        <div
          className="navbar-dropdown__item"
          onClick={(e) => {
             e.stopPropagation();
            navigate("/login");
            setShowDropdown(false);
          }}
        >
          <LogOut size={18} /> Logout
        </div>
      </div>
    )}
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
