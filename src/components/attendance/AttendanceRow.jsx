import "../../styles/attendance.css";

export default function AttendanceRow({ item }) {
  return (
    <div className="attendance-row">
      <div className="attendance-row__date">
        <span>{item.date?.split(" ")[0]}</span>
        <small>{item.day}</small>
      </div>

      <div className="attendance-row__cell">
        {item.clock_in?.slice(0, 5) || "-"}
      </div>

      <div className="attendance-row__cell">
        {item.clock_out?.slice(0, 5) || "-"}
      </div>

      <div className="attendance-row__cell">
        {item.productive_hrs?.slice(0, 5) || "-"}
      </div>

      <div className="attendance-row__status">
        <span
          className="status-badge"
          style={{
            backgroundColor: `${item.color}20`,
            color: item.color,
          }}
        >
          {item.status}
        </span>
      </div>
    </div>
  );
}