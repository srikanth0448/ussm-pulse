import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/requests.css";

const REQUEST_TYPES = [
  { id: "174", label: "Attendance" },
  { id: "175", label: "Week Off" },
  { id: "176", label: "WFH" },
  { id: "177", label: "On Duty" },
  { id: "181", label: "Early Logout" },
  { id: "182", label: "Late Login" },
  { id: "183", label: "Short Leave" },
];

function RequestModal({
  open,
  mode = "raise",
  request = null,
  onClose,
  onSubmit,
}) {
  const [type, setType] = useState(REQUEST_TYPES[0].id);
  const [fromDate, setFromDate] = useState(null);
  const [requestDate, setRequestDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [halfDay, setHalfDay] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const clearValidation = (key) => {
    setValidationErrors((prev) => {
      if (!prev || !prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const startOfDay = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const endOfDay = () => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  };

  useEffect(() => {
    if (open) {
      if (mode === "edit" && request) {
        // request.request_text contains the label (e.g. 'Attendance'), map it to our id
        const found = REQUEST_TYPES.find(
          (t) =>
            t.label === request.request_text ||
            String(t.id) === String(request.request_text) ||
            String(t.id) === String(request.request_type),
        );
        setType(found ? found.id : REQUEST_TYPES[0].id);
        const parseDate = (v) => {
          if (!v) return null;
          const m = moment(
            v,
            ["DD MMM YYYY", "DD-MM-YYYY", "YYYY-MM-DD", moment.ISO_8601],
            true,
          );
          if (m.isValid()) return m.toDate();
          const m2 = moment(v);
          return m2.isValid() ? m2.toDate() : null;
        };

        const parseTime = (v) => {
          if (!v) return null;
          const m = moment(v, ["hh:mm A", "HH:mm"], true);
          return m.isValid() ? m.toDate() : null;
        };

        setRequestDate(parseDate(request.request_date || request.from_date));
        setFromDate(parseDate(request.from_date));
        setToDate(parseDate(request.to_date));
        setFromTime(parseTime(request.from_time));
        setToTime(parseTime(request.to_time));
        setHalfDay(request.half_day_type || "");
        setReason(request.reason || "");
        setError("");
        setValidationErrors({});
      } else {
        // reset for raise
        setType(REQUEST_TYPES[0].id);
        setFromDate(null);
        setRequestDate(null);
        setToDate(null);
        setFromTime(null);
        setToTime(null);
        setHalfDay("");
        setReason("");
        setError("");
        setValidationErrors({});
      }
    }
  }, [open, mode, request]);

  if (!open) return null;

  const displayDate = (val) => {
    if (!val) return "";
    const m = moment(
      val,
      [moment.ISO_8601, "DD MMM YYYY", "DD-MM-YYYY", "YYYY-MM-DD"],
      true,
    );
    if (m.isValid()) return m.format("DD-MM-YYYY");
    try {
      const d = new Date(val);
      if (!isNaN(d)) return moment(d).format("DD-MM-YYYY");
    } catch (e) {}
    return String(val);
  };

  const submit = async (e) => {
    e.preventDefault();
    const formatDate = (d) => (d ? moment(d).format("YYYY-MM-DD") : "");
    const formatTime = (t) => (t ? moment(t).format("HH:mm") : "");

    const selectedLabel = REQUEST_TYPES.find((t) => t.id === type)?.label;

    // Per-field validation — collect errors and show them inline
    const errors = {};
    if (selectedLabel === "Attendance") {
      if (!requestDate) errors.requestDate = "Please select a date.";
      if (!fromTime || !toTime)
        errors.fromTime = "Please select both From and To times.";
      if (fromTime && toTime && moment(fromTime).isAfter(moment(toTime)))
        errors.fromTime = "From time cannot be later than To time.";
      if (!reason.trim()) errors.reason = "Please enter a reason.";
    }

    if (selectedLabel === "Short Leave") {
      if (!requestDate) errors.requestDate = "Please select a date.";
      if (!halfDay) errors.halfDay = "Please select First Half or Second Half.";
      if (!reason.trim()) errors.reason = "Please enter a reason.";
    }

    if (selectedLabel === "Week Off" || selectedLabel === "Early Logout") {
      if (!requestDate) errors.requestDate = "Please select a date.";
      if (!reason.trim()) errors.reason = "Please enter a reason.";
    }

    if (selectedLabel === "Late Login") {
      if (!requestDate) errors.requestDate = "Please select a date.";
      if (!fromTime) errors.fromTime = "Please select a time.";
      if (!reason.trim()) errors.reason = "Please enter a reason.";
    }

    if (selectedLabel === "WFH" || selectedLabel === "On Duty") {
      if (!fromDate) errors.fromDate = "Please select From date.";
      if (!toDate) errors.toDate = "Please select To date.";
      if (fromDate && toDate && moment(toDate).isBefore(moment(fromDate)))
        errors.toDate = "To date cannot be before From date.";
      if (!reason.trim()) errors.reason = "Please enter a reason.";
    }

    if (!reason.trim())
      errors.reason = errors.reason || "Please enter a reason.";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError("");
      return;
    }

    // Always include all fields in the payload. If a value is not present,
    // send an empty string so backend receives all keys.
    const payload = {
      request_text: type,
      request_date: "",
      from_date: "",
      to_date: "",
      from_time: "",
      to_time: "",
      half_day_type: "",
      reason: reason || "",
    };

    if (fromTime) payload.from_time = formatTime(fromTime);
    if (toTime) payload.to_time = formatTime(toTime);
    if (halfDay) payload.half_day_type = halfDay;
    if (toDate) payload.to_date = formatDate(toDate);

    const singleDateTypes = [
      "Week Off",
      "Attendance",
      "Early Logout",
      "Late Login",
      "Short Leave",
    ];
    if (singleDateTypes.includes(selectedLabel)) {
      payload.request_date = formatDate(requestDate) || "";
      payload.from_date = "";
    } else {
      payload.from_date = formatDate(fromDate) || "";
      payload.request_date = "";
    }

    setError("");
    setSubmitting(true);
    try {
      const ret = onSubmit && onSubmit(payload);
      if (ret && typeof ret.then === "function") {
        await ret;
      }
    } catch (err) {
      setError(err?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    // Clear all fields when user changes the request type
    setFromDate(null);
    setRequestDate(null);
    setToDate(null);
    setFromTime(null);
    setToTime(null);
    setHalfDay("");
    setReason("");
    setError("");
    setValidationErrors({});
  };

  return (
    <div className="rm-modal-overlay">
      <div className="rm-modal">
        <div className="rm-modal-header">
          <div className="rm-modal-title">
            {mode === "edit" ? "Edit Request" : "Raise a Request"}
          </div>
        </div>

        <form className="rm-modal-body" onSubmit={submit}>
          <div className="rm-field">
            <div className="rm-select-pill">
              <select
                value={type}
                onChange={handleTypeChange}
                className="rm-select"
              >
                {REQUEST_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <div className="rm-select-caret">▾</div>
            </div>
          </div>

          {(() => {
            const selectedLabel = REQUEST_TYPES.find(
              (t) => t.id === type,
            )?.label;

            // Short Leave: single date + half-day radios
            if (selectedLabel === "Short Leave") {
              return (
                <>
                  <label className="rm-label">Date</label>
                  {mode === "edit" ? (
                    <div
                      className={
                        "rm-input-display" +
                        (validationErrors.requestDate ? " invalid" : "")
                      }
                    >
                      {displayDate(requestDate)}
                    </div>
                  ) : (
                    <>
                      <DatePicker
                        selected={requestDate}
                        onChange={(d) => {
                          setRequestDate(d);
                          clearValidation("requestDate");
                          setError("");
                        }}
                        minDate={new Date()}
                        className={
                          "rm-input" +
                          (validationErrors.requestDate ? " invalid" : "")
                        }
                        dateFormat="dd-MM-yyyy"
                      />
                      {validationErrors.requestDate && (
                        <div className="rm-field-error">
                          {validationErrors.requestDate}
                        </div>
                      )}
                    </>
                  )}

                  <div className="rm-half-row">
                    <label>
                      <input
                        type="radio"
                        name="half"
                        value="First Half"
                        checked={halfDay === "First Half"}
                        onChange={() => {
                          setHalfDay("First Half");
                          clearValidation("halfDay");
                          setError("");
                        }}
                      />{" "}
                      First Half
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="half"
                        value="Second Half"
                        checked={halfDay === "Second Half"}
                        onChange={() => {
                          setHalfDay("Second Half");
                          clearValidation("halfDay");
                          setError("");
                        }}
                      />{" "}
                      Second Half
                    </label>
                  </div>
                  {validationErrors.halfDay && (
                    <div className="rm-field-error">
                      {validationErrors.halfDay}
                    </div>
                  )}
                </>
              );
            }

            // Attendance: date + from/to times
            if (selectedLabel === "Attendance") {
              return (
                <>
                  <label className="rm-label">Date</label>
                  {mode === "edit" ? (
                    <div
                      className={
                        "rm-input-display" +
                        (validationErrors.requestDate ? " invalid" : "")
                      }
                    >
                      {displayDate(requestDate)}
                    </div>
                  ) : (
                    <>
                      <DatePicker
                        selected={requestDate}
                        onChange={(d) => {
                          setRequestDate(d);
                          clearValidation("requestDate");
                          setError("");
                        }}
                        minDate={new Date()}
                        className={
                          "rm-input" +
                          (validationErrors.requestDate ? " invalid" : "")
                        }
                        dateFormat="dd-MM-yyyy"
                      />
                      {validationErrors.requestDate && (
                        <div className="rm-field-error">
                          {validationErrors.requestDate}
                        </div>
                      )}
                    </>
                  )}

                  <div className="rm-time-row">
                    <div>
                      <label className="rm-label">From Time</label>
                      <>
                        <DatePicker
                          selected={fromTime}
                          onChange={(d) => {
                            setFromTime(d);
                            setToTime(null);
                            clearValidation("fromTime");
                            setError("");
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="HH:mm"
                          timeFormat="HH:mm"
                          className={
                            "rm-time-input" +
                            (validationErrors.fromTime ? " invalid" : "")
                          }
                          minTime={startOfDay()}
                          maxTime={toTime ? toTime : endOfDay()}
                        />
                        {validationErrors.fromTime && (
                          <div className="rm-field-error">
                            {validationErrors.fromTime}
                          </div>
                        )}
                      </>
                    </div>
                    <div>
                      <label className="rm-label">To Time</label>
                      <>
                        <DatePicker
                          selected={toTime}
                          onChange={(d) => {
                            setToTime(d);
                            clearValidation("toTime");
                            setError("");
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="HH:mm"
                          timeFormat="HH:mm"
                          className={
                            "rm-time-input" +
                            (validationErrors.toTime ? " invalid" : "")
                          }
                          minTime={fromTime ? fromTime : startOfDay()}
                          maxTime={endOfDay()}
                        />
                        {validationErrors.toTime && (
                          <div className="rm-field-error">
                            {validationErrors.toTime}
                          </div>
                        )}
                      </>
                    </div>
                  </div>
                </>
              );
            }

            // Week Off and Early Logout: single date only
            if (
              selectedLabel === "Week Off" ||
              selectedLabel === "Early Logout"
            ) {
              return (
                <>
                  <label className="rm-label">Date</label>
                  {mode === "edit" ? (
                    <div
                      className={
                        "rm-input-display" +
                        (validationErrors.requestDate ? " invalid" : "")
                      }
                    >
                      {displayDate(requestDate)}
                    </div>
                  ) : (
                    <>
                      <DatePicker
                        selected={requestDate}
                        onChange={(d) => {
                          setRequestDate(d);
                          clearValidation("requestDate");
                          setError("");
                        }}
                        minDate={new Date()}
                        className={
                          "rm-input" +
                          (validationErrors.requestDate ? " invalid" : "")
                        }
                        dateFormat="dd-MM-yyyy"
                      />
                      {validationErrors.requestDate && (
                        <div className="rm-field-error">
                          {validationErrors.requestDate}
                        </div>
                      )}
                    </>
                  )}
                </>
              );
            }

            // Late Login: date + time (single)
            if (selectedLabel === "Late Login") {
              return (
                <>
                  <label className="rm-label">Date</label>
                  {mode === "edit" ? (
                    <div className="rm-input-display">
                      {displayDate(requestDate)}
                    </div>
                  ) : (
                    <DatePicker
                      selected={requestDate}
                      onChange={(d) => {
                        setRequestDate(d);
                        setError("");
                      }}
                      minDate={new Date()}
                      className="rm-input"
                      dateFormat="dd-MM-yyyy"
                    />
                  )}

                  <div className="rm-time-row">
                    <div>
                      <label className="rm-label">Time</label>
                      <DatePicker
                        selected={fromTime}
                        onChange={(d) => {
                          setFromTime(d);
                          setError("");
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        className="rm-time-input"
                      />
                    </div>
                  </div>
                </>
              );
            }

            // WFH / On Duty: from and to dates
            if (selectedLabel === "WFH" || selectedLabel === "On Duty") {
              return (
                <>
                  <div className="rm-dates-row">
                    <div>
                      <label className="rm-label">From Date</label>
                      {mode === "edit" ? (
                        <div
                          className={
                            "rm-input-display" +
                            (validationErrors.fromDate ? " invalid" : "")
                          }
                        >
                          {displayDate(fromDate)}
                        </div>
                      ) : (
                        <>
                          <DatePicker
                            selected={fromDate}
                            onChange={(d) => {
                              setFromDate(d);
                              clearValidation("fromDate");
                              setError("");
                            }}
                            minDate={new Date()}
                            className={
                              "rm-input" +
                              (validationErrors.fromDate ? " invalid" : "")
                            }
                            dateFormat="dd-MM-yyyy"
                          />
                          {validationErrors.fromDate && (
                            <div className="rm-field-error">
                              {validationErrors.fromDate}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div>
                      <label className="rm-label">To Date</label>
                      {mode === "edit" ? (
                        <div
                          className={
                            "rm-input-display" +
                            (validationErrors.toDate ? " invalid" : "")
                          }
                        >
                          {displayDate(toDate)}
                        </div>
                      ) : (
                        <>
                          <DatePicker
                            selected={toDate}
                            onChange={(d) => {
                              setToDate(d);
                              clearValidation("toDate");
                              setError("");
                            }}
                            minDate={fromDate || new Date()}
                            className={
                              "rm-input" +
                              (validationErrors.toDate ? " invalid" : "")
                            }
                            dateFormat="dd-MM-yyyy"
                          />
                          {validationErrors.toDate && (
                            <div className="rm-field-error">
                              {validationErrors.toDate}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              );
            }

            return null;
          })()}

          <label className="rm-label">Reason</label>
          <textarea
            className={
              "rm-textarea" + (validationErrors.reason ? " invalid" : "")
            }
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              clearValidation("reason");
              setError("");
            }}
          />
          {validationErrors.reason && (
            <div className="rm-field-error">{validationErrors.reason}</div>
          )}

          {error && <div className="rm-error">{error}</div>}

          <div className="rm-actions">
            <button type="button" className="rm-btn cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="rm-btn submit"
              disabled={submitting}
            >
              {mode === "edit"
                ? submitting
                  ? "UPDATING..."
                  : "Update"
                : submitting
                  ? "SUBMITTING..."
                  : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestModal;
