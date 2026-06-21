import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  Button,
  Form,
  Spinner,
  Pagination,
  Modal,
} from "react-bootstrap";
import { FaEdit, FaTimesCircle, FaPlus, FaArrowRight } from "react-icons/fa";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { useMyLeaves } from "../hooks/useMyLeaves";
import { useApplyLeave } from "../hooks/useApplyLeave";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { validateField, validateForm } from "../utils/leaveValidation";

export default function Leaves() {
  const { leaves, loading, error, refreshLeaves } = useMyLeaves();

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Modal and form state for Apply Leave
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    leaveType: "",
    leaveFor: "",
    fromDate: "",
    toDate: "",
    noOfDays: "",
    reason: "",
  });

  const {
    applyLeave,
    submitting,
    error: submitError,
    setError: setSubmitError,
  } = useApplyLeave();

  const [validationErrors, setValidationErrors] = useState({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  // helper to set or clear a single field error simply
  const setFieldError = (name, error) => {
    setValidationErrors((prev) => {
      if (!error) {
        const { [name]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: error };
    });
  };

  const openModal = () => {
    setValidationErrors({});
    if (submitError && setSubmitError) setSubmitError(null);
    setShowStatusModal(false);
    setStatusType(null);
    setStatusMessage("");
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);
  const modalId = "applyLeaveModal";
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusType, setStatusType] = useState(null); // 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState("");

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);
    const fieldError = validateField(name, value, newForm, startDate, endDate);
    setFieldError(name, fieldError);
    if (submitError && setSubmitError) setSubmitError(null);
  };

  const calculateNoOfDays = (sDate, eDate) => {
    if (!sDate || !eDate) return "";
    // calculate difference in days inclusive using UTC to avoid timezone issues
    const _s = Date.UTC(sDate.getFullYear(), sDate.getMonth(), sDate.getDate());
    const _e = Date.UTC(eDate.getFullYear(), eDate.getMonth(), eDate.getDate());
    const diff = Math.floor((_e - _s) / (1000 * 60 * 60 * 24));
    return String(diff + 1 >= 0 ? diff + 1 : 0);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null); // Reset end date when start date changes
    const formatted = date
      ? `${String(date.getDate()).padStart(2, "0")}-${date.toLocaleString(
          "en-GB",
          { month: "short" },
        )}-${date.getFullYear()}`
      : "";
    const newForm = { ...form, fromDate: formatted, toDate: form.toDate };
    // clear noOfDays when end date is reset
    newForm.noOfDays = "";
    setForm(newForm);
    // validate affected fields simply
    setFieldError(
      "fromDate",
      validateField("fromDate", formatted, newForm, date, null),
    );
    setFieldError(
      "toDate",
      validateField("toDate", newForm.toDate, newForm, date, null),
    );
    // clear any noOfDays error when end date reset
    setFieldError(
      "noOfDays",
      validateField("noOfDays", newForm.noOfDays, newForm, date, null),
    );
    if (submitError && setSubmitError) setSubmitError(null);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    const formatted = date
      ? `${String(date.getDate()).padStart(2, "0")}-${date.toLocaleString(
          "en-GB",
          { month: "short" },
        )}-${date.getFullYear()}`
      : "";
    const newForm = { ...form, toDate: formatted };
    // compute noOfDays from startDate and this end date
    newForm.noOfDays = calculateNoOfDays(startDate, date);
    setForm(newForm);
    setFieldError(
      "toDate",
      validateField("toDate", formatted, newForm, startDate, date),
    );
    // validate noOfDays after computing it
    setFieldError(
      "noOfDays",
      validateField("noOfDays", newForm.noOfDays, newForm, startDate, date),
    );
    if (submitError && setSubmitError) setSubmitError(null);
  };

  // validation functions imported from utils/leaveValidation

  const handleApplySubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm(form, startDate, endDate);
    if (Object.keys(errors).length) {
      setValidationErrors(errors);

      // focus first invalid control inside modal
      setTimeout(() => {
        const modalEl = document.getElementById(modalId);
        if (!modalEl) return;
        const firstInvalid = modalEl.querySelector(".is-invalid");
        if (firstInvalid && typeof firstInvalid.focus === "function") {
          firstInvalid.focus();
        }
      }, 50);

      return;
    }

    if (setSubmitError) setSubmitError(null);

    const result = await applyLeave({ form, startDate, endDate });
    if (result.status === true) {
      if (typeof refreshLeaves === "function") refreshLeaves();
      // close apply modal and show separate status modal
      closeModal();
      setStatusMessage(result.message);
      setStatusType("success");
      setShowStatusModal(true);
      setForm({
        leaveType: "",
        leaveFor: "",
        fromDate: "",
        toDate: "",
        noOfDays: "",
        reason: "",
      });
      setStartDate(null);
      setEndDate(null);
      setValidationErrors({});
    } else {
      setStatusMessage(result.message);
      setStatusType("error");
      setShowStatusModal(true);
    }
  };

  const toggleDetails = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-GB", { month: "short" });
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const getLeaveTypeShort = (leaveType) => {
    const type = (leaveType || "").toLowerCase().trim();

    switch (type) {
      case "casual leave":
        return "CL";

      case "sick leave":
        return "SL";

      case "loss of pay":
        return "LOP";

      case "earned leave":
        return "EL";

      case "maternity leave":
        return "ML";

      case "paternity leave":
        return "PL";

      case "work from home":
        return "WFH";

      case "compensatory off":
        return "COff";

      case "leave without pay":
        return "LWP";

      case "optional holiday":
        return "OH";

      default:
        return leaveType;
    }
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = (status || "").toLowerCase();

    switch (normalizedStatus) {
      case "approved":
        return "success";

      case "pending":
        return "warning";

      case "rejected":
        return "danger";

      case "cancelled":
        return "secondary";

      default:
        return "secondary";
    }
  };

  const filtered = leaves.filter((leave) => {
    if (
      statusFilter !== "All" &&
      (leave.status_text || "").toLowerCase() !== statusFilter.toLowerCase()
    ) {
      return false;
    }

    if (!search) return true;

    const searchText = search.toLowerCase();

    return (
      (leave.leave_type_text || "").toLowerCase().includes(searchText) ||
      (leave.reason || "").toLowerCase().includes(searchText)
    );
  });

  const totalPages = Math.ceil(filtered.length / recordsPerPage);

  const indexOfLastRecord = currentPage * recordsPerPage;

  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const currentRecords = filtered.slice(indexOfFirstRecord, indexOfLastRecord);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  return (
    <Container className="p-0">
      {/* status messages shown inside modal instead of toast */}
      {/* Header */}
      <Row className="align-items-center mb-3">
        <Col xs={6}>
          <h5 className="mb-0">My Leaves</h5>
        </Col>

        <Col xs={6} className="text-end">
          <Button variant="success" size="sm" onClick={openModal}>
            <FaPlus className="me-1" />
            Apply Leave
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-3 g-2">
        <Col xs={12} md={4}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Error */}
      {error && (
        <Card bg="danger" text="white" className="mb-3">
          <Card.Body>{error}</Card.Body>
        </Card>
      )}

      <div>
        {loading && filtered.length === 0 ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-4">No records found</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <Table bordered hover size="sm" className="align-middle">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {currentRecords?.map((leave) => (
                  <React.Fragment key={leave.leave_id}>
                    <tr>
                      <td className="text-center">
                        {getLeaveTypeShort(leave.leave_type_text)}
                      </td>

                      <td>
                        <div>{formatDate(leave.from_date)}</div>

                        {formatDate(leave.to_date)}
                      </td>

                      <td className="text-center">{leave.no_of_days}</td>

                      <td>
                        <span
                          className={`badge bg-${getStatusBadge(
                            leave.status_text,
                          )}`}
                          style={{ fontWeight: 400 }}
                        >
                          {leave.status_text}
                        </span>
                      </td>

                      <td>
                        <span onClick={() => toggleDetails(leave.leave_id)}>
                          {expandedRow === leave.leave_id ? (
                            <BsFillEyeSlashFill />
                          ) : (
                            <BsFillEyeFill />
                          )}
                        </span>
                      </td>
                    </tr>

                    {expandedRow === leave.leave_id && (
                      <tr>
                        <td colSpan="5" className="bg-light">
                          <div className="p-2">
                            <Row className="mb-2">
                              <Col xs={4}>
                                <strong>Leave</strong>
                              </Col>
                              <Col xs={8}>{leave.leave_type_text}</Col>
                            </Row>

                            <Row className="mb-2">
                              <Col xs={4}>
                                <strong>Start Date</strong>
                              </Col>
                              <Col xs={8}>{formatDate(leave.from_date)}</Col>
                            </Row>

                            <Row className="mb-2">
                              <Col xs={4}>
                                <strong>End Date</strong>
                              </Col>
                              <Col xs={8}>{formatDate(leave.to_date)}</Col>
                            </Row>

                            <Row className="mb-2">
                              <Col xs={4}>
                                <strong>No. of Days</strong>
                              </Col>
                              <Col xs={8}>{leave.no_of_days}</Col>
                            </Row>

                            <Row className="mb-2">
                              <Col xs={4}>
                                <strong>Reason</strong>
                              </Col>
                              <Col xs={8}>{leave.reason || "-"}</Col>
                            </Row>

                            {leave.status_text === "Pending" && (
                              <div className="mt-3 d-flex gap-2">
                                {leave.is_edit_icon_show === 1 && (
                                  <Button size="sm" variant="primary">
                                    <FaEdit className="me-1" />
                                    Edit
                                  </Button>
                                )}

                                {leave.is_cancel_icon_show === 1 && (
                                  <Button size="sm" variant="danger">
                                    <FaTimesCircle className="me-1" />
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
            <div className="text-center text-muted mb-2">
              Showing {indexOfFirstRecord + 1} -
              {Math.min(indexOfLastRecord, filtered.length)} of{" "}
              {filtered.length} records
            </div>
            {totalPages > 1 && (
              <Row className="mt-3">
                <Col>
                  <div className="d-flex justify-content-center">
                    <Pagination>
                      <Pagination.First
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(1)}
                      />

                      <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                      />

                      {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                          key={index + 1}
                          active={currentPage === index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}

                      <Pagination.Next
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                      />

                      <Pagination.Last
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                      />
                    </Pagination>
                  </div>
                </Col>
              </Row>
            )}
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      <Modal
        id={modalId}
        show={showModal}
        onHide={closeModal}
        centered
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Form onSubmit={handleApplySubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Apply Leave</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Leave Type <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="leaveType"
                    value={form.leaveType}
                    onChange={handleFormChange}
                    isInvalid={!!validationErrors.leaveType}
                  >
                    <option value="">Select Leave Type</option>
                    <option value="9">Casual Leave</option>
                    <option value="11">Leave Without Pay</option>
                    <option value="12">Compensatory Off</option>
                    <option value="13">Optional Holiday</option>
                    <option value="209">Maternity Leave</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.leaveType}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Leave For<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="leaveFor"
                    value={form.leaveFor}
                    onChange={handleFormChange}
                    isInvalid={!!validationErrors.leaveFor}
                  >
                    <option value="">Select Leave For</option>
                    <option value="1">Full Day</option>
                    <option value="2">Half Day</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.leaveFor}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    From<span className="text-danger">*</span>
                  </Form.Label>
                  <br />
                  <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    minDate={new Date()}
                    endDate={endDate}
                    dateFormat="dd-MMM-yyyy"
                    className={
                      "form-control" +
                      (validationErrors.fromDate ? " is-invalid" : "")
                    }
                  />
                  {validationErrors.fromDate && (
                    <div className="invalid-feedback d-block">
                      {validationErrors.fromDate}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    To<span className="text-danger">*</span>
                  </Form.Label>
                  <br />
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || new Date()}
                    dateFormat="dd-MMM-yyyy"
                    className={
                      "form-control" +
                      (validationErrors.toDate ? " is-invalid" : "")
                    }
                  />
                  {validationErrors.toDate && (
                    <div className="invalid-feedback d-block">
                      {validationErrors.toDate}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    No Of Days<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="noOfDays"
                    value={form.noOfDays}
                    onChange={handleFormChange}
                    isInvalid={!!validationErrors.noOfDays}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.noOfDays}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Reason</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="reason"
                    value={form.reason}
                    onChange={handleFormChange}
                    placeholder="Enter Reason"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>

            <Button variant="success" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Applying...
                </>
              ) : (
                <>
                  Apply Leave <FaArrowRight className="ms-2" />
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* Separate status modal */}
      <Modal
        show={showStatusModal}
        onHide={() => setShowStatusModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {statusType === "success" ? "Success" : "Error"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card
            bg={statusType === "success" ? "success" : "danger"}
            text="white"
          >
            <Card.Body>{statusMessage}</Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
