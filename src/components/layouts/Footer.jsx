import {
  Clock3,
  FileText,
  User,
  CalendarDays,
  Plus,
} from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <>
      {/* Floating Action Button */}
      <button className="footer-fab">
        <Plus size={26} />
      </button>

      {/* Bottom Navigation */}
      <footer className="footer-nav px-2">
        <button className="footer-nav__item footer-nav__item--active">
          <Clock3 size={20} />
          <span>Attendance</span>
        </button>

        <button className="footer-nav__item">
          <FileText size={20} />
          <span>Requests</span>
        </button>

        <button className="footer-nav__item">
          <User size={20} />
          <span>Leaves</span>
        </button>

        <button className="footer-nav__item">
          <CalendarDays size={20} />
          <span>Holidays</span>
        </button>
      </footer>
    </>
  );
}