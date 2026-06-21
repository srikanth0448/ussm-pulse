import { Mail, Phone, UserCircle2 } from "lucide-react";

import "./Profilepage.css";

function ProfileHeadercard({ profileData }) {
  const defaultprofileheader = profileData?.personal_details || {};
  const companydetails = profileData?.companyl_details || {};

  return (
    <div className="profile-header">
      <div className="profile-avatar">
        <UserCircle2 size={40} />
      </div>

      <div className="profile-info">
        <h2 className="employee-name">
          {defaultprofileheader.firstname} {defaultprofileheader.lastname}
        </h2>

        <div className="employee-meta">
          <span>{companydetails.designation}</span>

          <span>|</span>

          <span className="employee-id">
            Emp ID : {defaultprofileheader.emp_id}
          </span>
        </div>

        <div className="profile-contact">
          <div>
            <Mail size={18} />
            {defaultprofileheader.company_email}
          </div>

          <div>
            <Phone size={18} />
            {defaultprofileheader.mobile}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeadercard;
