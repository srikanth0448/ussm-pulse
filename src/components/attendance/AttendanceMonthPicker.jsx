import "../../styles/attendance.css";
import { CalendarDays } from "lucide-react";

export default function AttendanceMonthPicker({
  selectedMonth,
  onMonthChange,
}) {
  return (
    <div className="attendance-month-picker">
      <CalendarDays size={18} />

      <input
        type="month"
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
      />
    </div>
  );
}