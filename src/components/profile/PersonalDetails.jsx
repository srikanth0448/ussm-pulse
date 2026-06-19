import "./Profilepage.css";

function PersonalDetails({ profileData }) {
  const personal = profileData?.personal_details || {};

  return (
    <div className="details-section">
      <div className="detail-row">
        <span> Name</span>
        <strong>
          {personal.firstname || "-"} {personal.lastname || "-"}
        </strong>
      </div>

      <div className="detail-row">
        <span>Email</span>
        <strong>{personal.company_email || "-"}</strong>
      </div>

      <div className="detail-row">
        <span>Mobile</span>
        <strong>{personal.mobile || "-"}</strong>
      </div>

      <div className="detail-row">
        <span>Gender</span>
        <strong>{personal.emp_gender || "-"}</strong>
      </div>

      <div className="detail-row">
        <span>Date of Birth</span>
        <strong>{personal.emp_dob || "-"}</strong>
      </div>
      <div className="detail-row">
        <span>Marital Status</span>
        <strong>{personal.emp_marital_status || "-"}</strong>
      </div>
      <div className="detail-row">
        <span>PAN</span>
        <strong>{personal.emp_pan || "-"}</strong>
      </div>
      <div className="detail-row">
        <span>Aadhar</span>
        <strong>{personal.emp_aadhar || "-"}</strong>
      </div>
    </div>
  );
}

export default PersonalDetails;
