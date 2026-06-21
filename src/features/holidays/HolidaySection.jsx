import HolidayCard from "./HolidayCard";
import "./Holidays.css";

export default function HolidaySection({
  title,
  holidays,
 isOptional = false,
}) {
  return (
    <div className="holiday-section">
      <h2 className="holiday-section__title">
        {title}
      </h2>

      <div className="holiday-grid">
        {holidays.map((holiday, index) => (
          <HolidayCard
            key={index}
            holiday={holiday}
            isOptional={isOptional}
          />
        ))}
      </div>
    </div>
  );
}