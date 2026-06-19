import AttendanceRow from "../attendance/AttendanceRow";
import "../../styles/attendance.css";

export default function AttendanceTable({ attendanceData = [] }) {
  return (
    <div className="attendance-table">

      <div className="attendance-header-row">
        <div>Date</div>
        <div>In Time</div>
        <div>Out Time</div>
        <div>Hours</div>
        <div>Status</div>
      </div>

      {attendanceData.map((item) => (
        <AttendanceRow
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}