import { CalendarCheck2 } from "lucide-react";

export default function AttendanceHeader() {
  return (
    <div className="attendance-header">
      <div className="attendance-header__icon">
        <CalendarCheck2 size={24} />
      </div>

      <div>
        <h2>Attendance</h2>
        <p>View your daily attendance records</p>
      </div>
    </div>
  );
}
