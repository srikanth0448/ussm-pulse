export default function HolidayCard({
  holiday,
  isOptional = false
}) {
  const dateParts = holiday.h_date.split(" ");

  const day = dateParts[0];
  const month = dateParts[1];

  return (
    <div className="holiday-card">
   <div className={`holiday-card__date ${  isOptional ? "holiday-card__date--optional": ""}`}
>
  <span className="holiday-card__day">
    {day}
  </span>

  <span className="holiday-card__month">
    {month}
  </span>

  <span className="holiday-card__week">
    {holiday.week_name.slice(0, 3)}
  </span>
</div>

      <div className="holiday-card__content">
        <h3>{holiday.h_name}</h3>
        <p>{holiday.week_name}</p>
      </div>
    </div>
  );
}