import { api } from "../api/axiosClient";

export const attendanceService = {
  getAttendance: ({
    monthYear,
    userId,
    fromDate = "",
    toDate = "",
    status = "",
  }) =>
    api.get(
      `/emp-month-wise-attendance-report?month_year=${monthYear}&from_date=${fromDate}&to_date=${toDate}&user_id=${userId}&status=${status}`
    ),
};