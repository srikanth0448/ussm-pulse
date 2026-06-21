import { useState, useEffect } from "react";

import AttendanceSummary from "../features/attendance/AttendanceSummary";
import AttendanceHeader from "../features/attendance/AttendanceHeader";
import AttendanceMonthPicker from "../features/attendance/AttendanceMonthPicker";
import AttendanceTable from "../features/attendance/AttendanceTable";
import Loader from "../components/common/Loader";

import { attendanceService } from "../services/attendanceService";

function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const userId = sessionStorage.getItem("userid");

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const { data } = await attendanceService.getAttendance({
        monthYear: selectedMonth,
        userId,
        status: "",
      });

      console.log("Attendance API:", data);

      setAttendanceData(data?.data || []);
    } catch (error) {
      console.log("Attendance Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth]);

  return (
    <>
      <div className="fixedtop py-2 px-3">
        <AttendanceHeader />

        <AttendanceMonthPicker
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        <AttendanceSummary monthYear={selectedMonth} />
      </div>

      <div className="datadaywise">
        {loading ? (
          <div>
            <Loader />
          </div>
        ) : (
          <AttendanceTable attendanceData={attendanceData} />
        )}
      </div>
    </>
  );
}

export default AttendancePage;
