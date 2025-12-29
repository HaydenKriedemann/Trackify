import { useUser } from "../context/UserContext";
import { useCompanies } from "../context/CompaniesContext";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #4a90e2, #0070f3)",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    background: "white",
    borderRadius: "10px",
    padding: "40px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "700px",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "bold",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "2px solid #e1e5e9",
    borderRadius: "6px",
    fontSize: "16px",
    transition: "border-color 0.3s ease",
  },
  inputFocus: {
    borderColor: "#0070f3",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#0070f3",
    margin: "30px 0 15px 0",
    paddingBottom: "10px",
    borderBottom: "2px solid #f0f0f0",
  },
  button: {
    width: "100%",
    padding: "15px",
    background: "linear-gradient(135deg, #4a90e2, #0070f3)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "20px",
    transition: "transform 0.2s ease",
  },
  buttonHover: {
    transform: "translateY(-2px)",
  },
  companySearch: {
    marginBottom: "20px",
  },
  companyList: {
    border: "2px solid #e1e5e9",
    borderRadius: "6px",
    maxHeight: "200px",
    overflowY: "auto",
    marginTop: "10px",
    zIndex: 1000,
    position: "relative",
    background: "white",
  },
  companyItem: {
    padding: "12px",
    borderBottom: "1px solid #f0f0f0",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  companyItemHover: {
    backgroundColor: "#f8f9fa",
  },
  selectedCompany: {
    backgroundColor: "#e3f2fd",
    borderLeft: "4px solid #0070f3",
  },
  noCompanies: {
    padding: "20px",
    textAlign: "center",
    color: "#666",
  },
  createNewCompany: {
    textAlign: "center",
    marginTop: "20px",
    padding: "15px",
    border: "2px dashed #0070f3",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#0070f3",
    fontWeight: "600",
  },
  selectedCompanyDisplay: {
    padding: '15px', 
    background: '#e8f5e8', 
    borderRadius: '6px', 
    marginBottom: '20px',
    border: '1px solid #4caf50'
  }
};

export default function EmployeeOnboarding() {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const { companies, addEmployeeToCompany } = useCompanies();
  
  const [formData, setFormData] = useState({
    companyId: "",
    companyName: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    department: "",
    startDate: "",
    managerName: "",
    employeeId: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    password: "",
    confirmPassword: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showCompanyList, setShowCompanyList] = useState(false);
  const [hasSelectedCompany, setHasSelectedCompany] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCompanySearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowCompanyList(true);
    
    // If user clears the search, clear the selection
    if (value === "") {
      setFormData(prev => ({
        ...prev,
        companyId: "",
        companyName: ""
      }));
      setHasSelectedCompany(false);
    }
  };

  const selectCompany = (company) => {
    console.log("Selected company:", company); // Debug log
    setFormData({
      ...formData,
      companyId: company.id,
      companyName: company.companyName,
    });
    setHasSelectedCompany(true);
    setShowCompanyList(false);
    setSearchTerm(company.companyName);
  };

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.companyEmail && company.companyEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateNewCompany = () => {
    if (window.confirm("You need to create a company first. Redirect to company creation?")) {
      navigate("/employer-onboarding");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Form data on submit:", formData); // Debug log
    console.log("Companies available:", companies); // Debug log
    
    if (!formData.companyId || !hasSelectedCompany) {
      alert("Please select a company to join. Search for your company and click on it from the list.");
      return;
    }
    
    // Get company data
    const selectedCompany = companies.find(c => c.id === formData.companyId);
    
    if (!selectedCompany) {
      alert("Selected company not found. Please try selecting the company again.");
      return;
    }
    
    // Create employee data
    const employeeData = {
      ...formData,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString(),
      role: 'employee'
    };
    
    // Add employee to company in the context
    addEmployeeToCompany(formData.companyId, employeeData);
    
    // Save user data
    updateUser(employeeData);
    localStorage.setItem('userRole', 'employee');
    localStorage.setItem('currentEmployee', JSON.stringify(employeeData));
    
    // Navigate to employee dashboard
    navigate("/employee-dashboard");
  };

  // Debug: Log when companies change
  useEffect(() => {
    console.log("Companies updated:", companies);
  }, [companies]);

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Join Your Company</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Company Selection */}
          <h2 style={styles.sectionTitle}>Company Information</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Search Your Company *</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Search by company name or email..."
              value={searchTerm}
              onChange={handleCompanySearch}
              onFocus={() => setShowCompanyList(true)}
              required
            />
            
            {showCompanyList && filteredCompanies.length > 0 && (
              <div style={styles.companyList}>
                {filteredCompanies.map(company => (
                  <div
                    key={company.id}
                    style={{
                      ...styles.companyItem,
                      ...(formData.companyId === company.id ? styles.selectedCompany : {})
                    }}
                    onClick={() => selectCompany(company)}
                    onMouseOver={(e) => e.target.style.backgroundColor = styles.companyItemHover.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = formData.companyId === company.id ? styles.selectedCompany.backgroundColor : 'transparent'}
                  >
                    <div style={{ fontWeight: 'bold', color: '#333' }}>
                      {company.companyName}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {company.companyEmail} • {company.city || 'Unknown Location'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {company.industry || 'Education'} • {company.employees?.length || 0} employees
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {showCompanyList && searchTerm && filteredCompanies.length === 0 && (
              <div style={styles.companyList}>
                <div style={styles.noCompanies}>
                  No companies found matching "{searchTerm}"
                </div>
              </div>
            )}
          </div>

          {hasSelectedCompany && formData.companyName && (
            <div style={styles.selectedCompanyDisplay}>
              <strong>Selected Company:</strong> {formData.companyName}
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Company ID: {formData.companyId}
              </div>
            </div>
          )}

          {companies.length === 0 && !searchTerm && (
            <div style={styles.noCompanies}>
              No companies registered yet. Create one first!
            </div>
          )}

          <div style={styles.createNewCompany} onClick={handleCreateNewCompany}>
            Can't find your company? Click here to create a new company.
          </div>

          {/* Personal Information */}
          <h2 style={styles.sectionTitle}>Personal Information</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>First Name *</label>
            <input
              style={styles.input}
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Last Name *</label>
            <input
              style={styles.input}
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Date of Birth</label>
            <input
              style={styles.input}
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Gender</label>
            <select
              style={styles.input}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {/* Contact Information */}
          <h2 style={styles.sectionTitle}>Contact Information</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address *</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              style={styles.input}
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          {/* Employment Information */}
          <h2 style={styles.sectionTitle}>Employment Information</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Job Title / Role *</label>
            <input
              style={styles.input}
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Department / Team</label>
            <input
              style={styles.input}
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Employee ID (if any)</label>
            <input
              style={styles.input}
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Start Date</label>
            <input
              style={styles.input}
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Manager / Supervisor Name</label>
            <input
              style={styles.input}
              type="text"
              name="managerName"
              value={formData.managerName}
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          {/* Emergency Contact */}
          <h2 style={styles.sectionTitle}>Emergency Contact</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Emergency Contact Name</label>
            <input
              style={styles.input}
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Emergency Contact Phone</label>
            <input
              style={styles.input}
              type="tel"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          {/* Login Information */}
          <h2 style={styles.sectionTitle}>Login Information</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password *</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password *</label>
            <input
              style={styles.input}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => e.target.style.transform = styles.buttonHover.transform}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            Join Company & Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}
