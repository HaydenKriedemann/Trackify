import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('company');
  const [companyData, setCompanyData] = useState({
    name: "",
    email: "",
    phone: "",
    registrationNumber: "",
    vatNumber: "",
    industry: "",
    size: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    },
    banking: {
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      branchCode: "",
      accountType: ""
    }
  });

  useEffect(() => {
    // In real app, fetch company data from backend
    if (user?.company) {
      // Fetch company details
    }
  }, [user]);

  const handleSave = async () => {
    // Save to backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="employer" />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Business Settings</h1>
          <p>Configure your business preferences and settings</p>
        </header>

        <div className="settings-container">
          <div className="settings-tabs">
            <button 
              className={`tab-button ${activeTab === 'company' ? 'active' : ''}`}
              onClick={() => setActiveTab('company')}
            >
              Company Information
            </button>
            <button 
              className={`tab-button ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveTab('billing')}
            >
              Billing & Invoicing
            </button>
            <button 
              className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
            <button 
              className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
          </div>

          <div className="settings-content">
            {activeTab === 'company' && (
              <div className="settings-section">
                <h2>Company Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyData.name}
                      onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={companyData.email}
                      onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Registration Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyData.registrationNumber}
                      onChange={(e) => setCompanyData({...companyData, registrationNumber: e.target.value})}
                    />
                  </div>
                </div>

                <h3 style={{marginTop: '30px'}}>Address</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyData.address.street}
                      onChange={(e) => setCompanyData({
                        ...companyData, 
                        address: {...companyData.address, street: e.target.value}
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyData.address.city}
                      onChange={(e) => setCompanyData({
                        ...companyData, 
                        address: {...companyData.address, city: e.target.value}
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>State/Province</label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyData.address.state}
                      onChange={(e) => setCompanyData({
                        ...companyData, 
                        address: {...companyData.address, state: e.target.value}
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP/Postal Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyData.address.zipCode}
                      onChange={(e) => setCompanyData({
                        ...companyData, 
                        address: {...companyData.address, zipCode: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="settings-section">
                <h2>Billing & Invoicing</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyData.banking.bankName}
                      onChange={(e) => setCompanyData({
                        ...companyData, 
                        banking: {...companyData.banking, bankName: e.target.value}
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Holder</label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyData.banking.accountHolder}
                      onChange={(e) => setCompanyData({
                        ...companyData, 
                        banking: {...companyData.banking, accountHolder: e.target.value}
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyData.banking.accountNumber}
                      onChange={(e) => setCompanyData({
                        ...companyData, 
                        banking: {...companyData.banking, accountNumber: e.target.value}
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Branch Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyData.banking.branchCode}
                      onChange={(e) => setCompanyData({
                        ...companyData, 
                        banking: {...companyData.banking, branchCode: e.target.value}
                      })}
                    />
                  </div>
                </div>

                <div className="invoice-settings">
                  <h3>Invoice Settings</h3>
                  <div className="form-group">
                    <label>Default Payment Terms (days)</label>
                    <input
                      type="number"
                      className="form-input"
                      defaultValue={30}
                    />
                  </div>
                  <div className="form-group">
                    <label>Invoice Prefix</label>
                    <input
                      type="text"
                      className="form-input"
                      defaultValue="INV"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h2>Notification Preferences</h2>
                <div className="notification-settings">
                  <div className="notification-item">
                    <div>
                      <h4>Email Notifications</h4>
                      <p>Receive email alerts for new sessions and invoices</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div>
                      <h4>Weekly Reports</h4>
                      <p>Get weekly performance reports emailed to you</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div>
                      <h4>Invoice Reminders</h4>
                      <p>Remind clients about upcoming due dates</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <h2>Security Settings</h2>
                <div className="security-settings">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" className="form-input" />
                  </div>
                  <button className="primary-btn">Update Password</button>
                </div>
              </div>
            )}
          </div>

          <div className="settings-actions">
            <button className="primary-btn" onClick={handleSave}>Save Changes</button>
            <button className="secondary-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;