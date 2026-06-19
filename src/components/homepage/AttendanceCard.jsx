import { CalendarDays } from "lucide-react";
import "./Attendence.css";

export default function AttendanceCard({
  homeData,
  onClockAction,
}) {
  if (!homeData) return null;

  const buttonText = homeData.clock_status === 1 ? "IN" : " OUT";
  

  return (
    <div className="attendance-card mb-3">

      <div className="attendance-card__header">

        <div className="attendance-card__date">
          <CalendarDays size={20} />

          <span>
            {homeData.currentDate}
          </span>
        </div>

        <div className="attendance-card__status">
          Present
        </div>

      </div>

      <div className="attendance-card__content">

        <div className="attendance-card__body">

          <div className="attendance-card__item">
            <span className="attendance-card__label">
              Clock-In :
            </span>

            <span className="attendance-card__value">
              {homeData.clock_in_time?.slice(0, 5)}
            </span>
          </div>

          <div className="attendance-card__divider" />

          <div className="attendance-card__item">
            <span className="attendance-card__label">
              Late By :
            </span>

            <span className="attendance-card__value">
              {homeData.late_by?.slice(0, 5)}
            </span>
          </div>

          <div className="attendance-card__divider" />

          <div className="attendance-card__item">
            <span className="attendance-card__label">
              Clock-Out :
            </span>

            <span className="attendance-card__value">
              {homeData.clock_out_time?.slice(0, 5)}
            </span>
          </div>

          <div className="attendance-card__divider" />

          <div className="attendance-card__item">
            <span className="attendance-card__label">
              Productive Hrs.
            </span>

            <span className="attendance-card__value">
              {homeData.productive_hours?.slice(0, 5)}
            </span>
          </div>

        </div>

        <div className="attendance-card__action">
    <button
  className={`attendance-card__btn mt-2 ${
    homeData.clock_status === 1
      ? "attendance-card__btn--clockin"
      : "attendance-card__btn--clockout"
  }`}
  onClick={onClockAction}
>
  {buttonText}
</button>
        </div>

      </div>
    </div>
  );
}