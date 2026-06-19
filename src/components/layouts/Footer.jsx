import { Clock3, FileText, User, CalendarDays, Plus,Home } from "lucide-react";
import { NavLink,useLocation  } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const location = useLocation();
  const fabPages = [
  "/requests",
];

const showFab = fabPages.includes(location.pathname);

  return (
    <>
      {/* Floating Action Button */}

  {showFab && (
    <NavLink to="/add" className="footer-fab" aria-label="Add">
          <Plus size={26} />
        </NavLink>

  )}



   
      {/* Bottom Navigation */}
      <footer className="footer-nav px-2">

       <NavLink
          to="/HomePage"
          end
          className={({ isActive }) =>
            "footer-nav__item" + (isActive ? " footer-nav__item--active" : "")
          }
        >
          <Home size={20} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/attendance"
          end
          className={({ isActive }) =>
            "footer-nav__item" + (isActive ? " footer-nav__item--active" : "")
          }
        >
          <Clock3 size={20} />
          <span>Attendance</span>
        </NavLink>

        <NavLink
          to="/requests"
          className={({ isActive }) =>
            "footer-nav__item" + (isActive ? " footer-nav__item--active" : "")
          }
        >
          <FileText size={20} />
          <span>Requests</span>
        </NavLink>

        <NavLink
          to="/leaves"
          className={({ isActive }) =>
            "footer-nav__item" + (isActive ? " footer-nav__item--active" : "")
          }
        >
          <User size={20} />
          <span>Leaves</span>
        </NavLink>

        <NavLink
          to="/holidays"
          className={({ isActive }) =>
            "footer-nav__item" + (isActive ? " footer-nav__item--active" : "")
          }
        >
          <CalendarDays size={20} />
          <span>Holidays</span>
        </NavLink>
      </footer>
    </>
  );
}
