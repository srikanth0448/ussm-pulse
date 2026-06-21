import "../../styles/attendance.css";
import { api } from "../../services/api/axiosClient";
import { useEffect, useState } from "react";

export default function AttendanceSummary({ monthYear }) {
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchSummary = async () => {
    try {
      console.log("Month Year:", monthYear);

      const { data } = await api.get(
        `/emp-attendance-monthly-info?month_year=${monthYear}`,
      );

      console.log("Attendance Summary API:", data);

      setAttendanceData(data?.attendance_monthly_info || []);
    } catch (error) {
      console.log("Attendance API Error:", error);
    }
  };

  useEffect(() => {
    if (monthYear) {
      fetchSummary();
    }
  }, [monthYear]);

  useEffect(() => {
    console.log("Attendance State:", attendanceData);
  }, [attendanceData]);

  return (
    <div className="attendance-summary">
      {attendanceData.map((item, index) => (
        <div key={index} className="summary-wrapper">
          <div className="summary-card">
            <h4>{item.total_days || 0}</h4>
            <span>Total Days</span>
          </div>

          <div className="summary-card">
            <h4>{item.present || 0}</h4>
            <span>Present</span>
          </div>

          <div className="summary-card">
            <h4>{item.absent || 0}</h4>
            <span>Absent</span>
          </div>

          <div className="summary-card">
            <h4>{item.casual_leave || 0}</h4>
            <span>Leave</span>
          </div>

          <div className="summary-card">
            <h4>{item.week_off || 0}</h4>
            <span>Week Off</span>
          </div>
        </div>
      ))}
    </div>
  );
}
