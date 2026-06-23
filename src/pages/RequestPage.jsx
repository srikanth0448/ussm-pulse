import React, { useEffect, useState } from "react";
import { requestService } from "../services/requestService";
import "../styles/requests.css";
import RequestModal from "../features/requests/RequestModal";
import RequestList from "../features/requests/RequestList";

function RequestPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("raise");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = () => {
    setLoading(true);
    requestService
      .getMyRequests()
      .then((res) => {
        if (res && res.data && res.data.data) {
          setRequests(res.data.data);
        } else {
          setRequests([]);
        }
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleEdit = (item) => {
    setSelectedRequest(item);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleCancel = (item) => {
    if (!window.confirm("Are you sure you want to cancel this request?"))
      return;
    requestService
      .cancelRequest(item.request_id)
      .then(() => fetchRequests())
      .catch(() => alert("Failed to cancel request"));
  };

  return (
    <div className="requests-page container">
      <div className="requests-header-bar">
        <h2 className="requests-title">Requests</h2>
        <div className="requests-header-actions">
          <button
            className="btn-raise"
            onClick={() => {
              setModalMode("raise");
              setModalOpen(true);
            }}
          >
            Raise a Request
          </button>
        </div>
      </div>

      {loading && <div className="requests-loading">Loading...</div>}
      {error && <div className="requests-error">Failed to load requests.</div>}

      <RequestList
        requests={requests}
        loading={loading}
        onEdit={handleEdit}
        onCancel={handleCancel}
      />

      <RequestModal
        open={modalOpen}
        mode={modalMode}
        request={selectedRequest}
        onClose={() => {
          setModalOpen(false);
          setSelectedRequest(null);
        }}
        onSubmit={(payload) => {
          if (modalMode === "edit" && selectedRequest) {
            requestService
              .updateRequest(selectedRequest.request_id, payload)
              .then(() => {
                setModalOpen(false);
                setSelectedRequest(null);
                fetchRequests();
              })
              .catch(() => alert("Failed to update request"));
          } else {
            requestService
              .createRequest(payload)
              .then(() => {
                setModalOpen(false);
                fetchRequests();
              })
              .catch(() => alert("Failed to create request"));
          }
        }}
      />
    </div>
  );
}

export default RequestPage;
