import { useEffect, useState } from "react";

import { api } from "../services/api/axiosClient";

import ProfileHeadercard from "../features/profile/ProfileHeadercard";
import CompanyDetails from "../features/profile/CompanyDetails";
import PersonalDetails from "../features/profile/PersonalDetails";
import Loader from "../components/common/Loader";

import "../features/profile/Profilepage.css";

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);

  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/get-profile");

      console.log("Profile Data:", response.data);

      setProfileData(response.data);
    } catch (error) {
      console.error("Profile API Error:", error);
    }
  };

  if (!profileData) {
    return <Loader />;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <ProfileHeadercard profileData={profileData} />

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Details
          </button>

          <button
            className={`tab-btn ${activeTab === "company" ? "active" : ""}`}
            onClick={() => setActiveTab("company")}
          >
            Company Details
          </button>
        </div>

        {activeTab === "personal" ? (
          <PersonalDetails profileData={profileData} />
        ) : (
          <CompanyDetails profileData={profileData} />
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
