import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
    borderColor: "#667eea",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#667eea",
    margin: "30px 0 15px 0",
    paddingBottom: "10px",
    borderBottom: "2px solid #f0f0f0",
  },
  button: {
    width: "100%",
    padding: "15px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
  error: {
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: "15px",
    padding: "10px",
    background: "#ffeaa7",
    borderRadius: "4px",
  }
};

export default function EmployerOnboarding() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    position: "",
    workEmail: "",
    workPhone: "",
    
    // Company Information
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyRegistration: "",
    companyVAT: "",
    industry: "",
    companySize: "",
    
    // Company Address
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    
    // Banking Details
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    branchCode: "",
    accountType: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Prepare data for backend
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "employer",
        companyData: {
          name: formData.companyName,
          email: formData.companyEmail,
          phone: formData.companyPhone,
          registrationNumber: formData.companyRegistration,
          vatNumber: formData.companyVAT,
          industry: formData.industry,
          size: formData.companySize,
          address: {
            street: formData.streetAddress,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          },
          banking: {
            bankName: formData.bankName,
            accountHolder: formData.accountHolder,
            accountNumber: formData.accountNumber,
            branchCode: formData.branchCode,
            accountType: formData.accountType
          }
        },
        profile: {
          phone: formData.workPhone,
          position: formData.position
        }
      };

      // Register with backend API
      await register(userData);
      
      // Navigate to employer dashboard
      navigate("/employer-dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Create Your Business Account</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <h2 style={styles.sectionTitle}>Your Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name *</label>
              <input
                style={styles.input}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
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
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Your Position *</label>
            <input
              style={styles.input}
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Work Phone</label>
            <input
              style={styles.input}
              type="tel"
              name="workPhone"
              value={formData.workPhone}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password *</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
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
              />
            </div>
          </div>

          {/* Company Information */}
          <h2 style={styles.sectionTitle}>Company Information</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Company Name *</label>
            <input
              style={styles.input}
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Company Registration Number</label>
            <input
              style={styles.input}
              type="text"
              name="companyRegistration"
              value={formData.companyRegistration}
              onChange={handleChange}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>VAT Number</label>
            <input
              style={styles.input}
              type="text"
              name="companyVAT"
              value={formData.companyVAT}
              onChange={handleChange}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Company Email *</label>
            <input
              style={styles.input}
              type="email"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Company Phone *</label>
            <input
              style={styles.input}
              type="tel"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Industry</label>
            <input
              style={styles.input}
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Company Size</label>
            <select
              style={styles.input}
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501+">501+ employees</option>
            </select>
          </div>

          {/* Company Address */}
          <h2 style={styles.sectionTitle}>Company Address</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Street Address</label>
            <input
              style={styles.input}
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input
                style={styles.input}
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>State/Province</label>
              <input
                style={styles.input}
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>ZIP/Postal Code</label>
              <input
                style={styles.input}
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Country</label>
              <input
                style={styles.input}
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Banking Details */}
          <h2 style={styles.sectionTitle}>Banking Details</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Bank Name</label>
            <input
              style={styles.input}
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Account Holder Name</label>
            <input
              style={styles.input}
              type="text"
              name="accountHolder"
              value={formData.accountHolder}
              onChange={handleChange}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Account Number</label>
            <input
              style={styles.input}
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Branch Code</label>
              <input
                style={styles.input}
                type="text"
                name="branchCode"
                value={formData.branchCode}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Account Type</label>
              <select
                style={styles.input}
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
              >
                <option value="">Select account type</option>
                <option value="cheque">Cheque Account</option>
                <option value="savings">Savings Account</option>
                <option value="business">Business Account</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            onMouseOver={(e) => e.target.style.transform = styles.buttonHover.transform}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            {loading ? 'Creating Account...' : 'Create Business Account'}
          </button>
        </form>
      </div>
    </div>
  );
}