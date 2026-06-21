import { useEffect, useState } from "react";
import HolidaySection from "../features/holidays/HolidaySection";
import "../features/holidays/Holidays.css";
import { api } from "../services/api/axiosClient";
import { CalendarDays, ChevronDown } from "lucide-react";
import Loader from "../components/common/Loader";

export default function HolidaysList() {
  const [holidayData, setHolidayData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2025);

  useEffect(() => {
    getHolidayList(selectedYear);
  }, [selectedYear]);

  const getHolidayList = async (year) => {
    try {
      const { data } = await api.post(`/holidays-list?year=${year}`);

      console.log("Holiday Data:", data);
      setHolidayData(data);
    } catch (error) {
      console.log("Holiday API Error:", error);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  if (!holidayData) {
    return <Loader />;
  }

  const fixedHolidays = holidayData?.data?.fixed_holidays || [];
  const optionalHolidays = holidayData?.data?.optional_holidays || [];

  return (
    <div className="holidays-page">
      <div className="holidays-page__header">
        <h1 className="pageheader">Holidays</h1>

        <div className="calender-datesection">
          <CalendarDays className="calendar-icon" size={17} color="#0b61df" />

          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="holidays-page__select"
          >
            {holidayData?.years?.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <ChevronDown className="dropdown-icon" size={16} />
        </div>
      </div>

      {fixedHolidays.length === 0 && optionalHolidays.length === 0 ? (
        <div className="no-holidays">
          No holidays available for {selectedYear}
        </div>
      ) : (
        <>
          {fixedHolidays.length > 0 && (
            <HolidaySection title="Fixed Holidays" holidays={fixedHolidays} />
          )}

          {optionalHolidays.length > 0 && (
            <HolidaySection
              title="Optional Holidays (Any 2)"
              holidays={optionalHolidays}
              isOptional={true}
            />
          )}
        </>
      )}
    </div>
  );
}
