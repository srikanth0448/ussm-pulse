import "./Profilepage.css";

function CompanyDetails({ profileData }) {
  const company = profileData?.companyl_details || {};
  const personal = profileData?.personal_details || {};

  return (
    <div className="details-section">
      <div className="detail-row">
        <span>Employee ID</span>
        <strong>{personal.emp_id || "-"}</strong>
      </div>
      <div className="detail-row">
        <span>Company </span>
        <strong>{company.comapny || "-"}</strong>
      </div>

      <div className="detail-row">
        <span>Department</span>
        <strong>{company.department || "-"}</strong>
      </div>

      <div className="detail-row">
        <span>Designation</span>
        <strong>{company.designation || "-"}</strong>
      </div>

      <div className="detail-row">
        <span>Joining Date</span>
        <strong>{company.joining_date || "-"}</strong>
      </div>

      <div className="detail-row">
        <span>Reporting Manager</span>
        <strong>{company.reporting_manager || "-"}</strong>
      </div>
    </div>
  );
}

export default CompanyDetails;
