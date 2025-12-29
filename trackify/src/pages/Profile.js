import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useUser } from "../context/UserContext";

function Profile() {
  const { user } = useUser();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    startDate: "",
    dateOfBirth: "",
    gender: "",
    emergencyContactName: "",
    emergencyContactPhone: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        position: user.jobTitle || "",
        department: user.department || "",
        startDate: user.startDate || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        emergencyContactName: user.emergencyContactName || "",
        emergencyContactPhone: user.emergencyContactPhone || ""
      });
    }
  }, [user]);

  const handleSave = () => {
    setIsEditing(false);
    // In real app, you would save to backend here
    console.log("Profile saved:", profile);
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <Sidebar role="employee" />
        <div className="dashboard-content">
          <header className="dashboard-header">
            <h1>My Profile</h1>
            <p>Please complete onboarding to view your profile</p>
          </header>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar role="employee" />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>My Profile</h1>
          <p>Manage your personal and professional information</p>
        </header>

        <div className="profile-card">
          <div className="section-header">
            <h2>Personal Information</h2>
            <button 
              className={isEditing ? "secondary-btn" : "primary-btn"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <input
                  type="text"
                  value={profile.gender}
                  onChange={(e) => setProfile({...profile, gender: e.target.value})}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  value={profile.position}
                  onChange={(e) => setProfile({...profile, position: e.target.value})}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => setProfile({...profile, department: e.target.value})}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={profile.startDate}
                onChange={(e) => setProfile({...profile, startDate: e.target.value})}
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Emergency Contact Name</label>
                <input
                  type="text"
                  value={profile.emergencyContactName}
                  onChange={(e) => setProfile({...profile, emergencyContactName: e.target.value})}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={profile.emergencyContactPhone}
                  onChange={(e) => setProfile({...profile, emergencyContactPhone: e.target.value})}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="card">
            <h2>Total Hours Worked</h2>
            <p>120 hours</p>
          </div>
          <div className="card">
            <h2>Completed Tasks</h2>
            <p>15 tasks</p>
          </div>
          <div className="card">
            <h2>Active Clients</h2>
            <p>3 clients</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;