import React from "react";

function RequestList({ requests, loading, onEdit, onCancel }) {
  return (
    <div className="requests-list">
      {requests.length === 0 && !loading && (
        <div className="requests-empty">No requests found.</div>
      )}

      {requests.map((r) => (
        <div key={r.request_id} className="request-card">
          <div className="request-card-inner">
            <div className="request-left">
              <div className="request-title">{r.request_text}</div>

              {(r.request_date || r.from_date || r.to_date) && (
                <div className="request-row">
                  <svg
                    className="icon icon-calendar"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M16 2v4M8 2v4"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="request-meta">
                    {r.half_day_type ? (
                      <span className="request-date">
                        {r.request_date || r.from_date}
                      </span>
                    ) : r.to_date &&
                      r.to_date !== (r.from_date || r.request_date) ? (
                      <>
                        <span className="request-date">
                          {r.from_date || r.request_date}
                        </span>
                        <span className="request-date"> to {r.to_date}</span>
                      </>
                    ) : (
                      <span className="request-date">
                        {r.request_date || r.from_date}
                      </span>
                    )}
                    {r.half_day_type ? (
                      <span className="half"> {r.half_day_type}</span>
                    ) : null}
                  </div>
                </div>
              )}

              {(r.from_time || r.to_time) && (
                <div className="request-row">
                  <svg
                    className="icon icon-clock"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 7v5l3 2"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="request-meta">
                    <span className="request-time">
                      {r.from_time || ""}
                      {r.from_time && r.to_time ? " - " : ""}
                      {r.to_time || ""}
                    </span>
                  </div>
                </div>
              )}

              {r.reason && (
                <div className="request-row">
                  <svg
                    className="icon icon-note"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 15V7a2 2 0 0 0-2-2H7L3 9v8a2 2 0 0 0 2 2h11"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 11h8M8 15h5"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="request-meta request-reason">{r.reason}</div>
                </div>
              )}
            </div>

            <div className="request-right">
              <div
                className={`request-status ${String(r.status_text).toLowerCase()}`}
              >
                {r.status_text}
              </div>
            </div>
          </div>

          <div className="request-card-actions">
            <div className="action-left">
              {Number(r.is_edit_icon_show) === 2 && (
                <button className="action-btn edit" onClick={() => onEdit(r)}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
                      stroke="#2b6cb0"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      stroke="#2b6cb0"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Edit
                </button>
              )}
            </div>

            <div className="action-right">
              {Number(r.is_cancel_icon_show) === 2 && (
                <button
                  className="action-btn cancel"
                  onClick={() => onCancel(r)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="#444"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RequestList;
