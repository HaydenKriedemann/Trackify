import React from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #4a90e2, #0070f3)",
    color: "white",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
    padding: "20px",
  },
  logo: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#0070f3",
    fontSize: "40px",
    fontWeight: "bold",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "48px",
    fontWeight: "bold",
    margin: "10px 0",
    textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
  },
  slogan: {
    fontSize: "20px",
    marginBottom: "40px",
    textShadow: "0.5px 0.5px 1px rgba(0,0,0,0.2)",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
  },
  button: {
    padding: "20px 40px",
    fontSize: "20px",
    fontWeight: "bold",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  employerButton: {
    backgroundColor: "white",
    color: "#0070f3",
  },
  employeeButton: {
    backgroundColor: "#0070f3",
    color: "white",
    border: "2px solid white",
  },
};

export default function LandingPage() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    // Go to login page first with role selection
    navigate("/login", { state: { role } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.logo}>T</div>
      <div style={styles.title}>Trackify</div>
      <div style={styles.slogan}>
        Your trusted platform for hourly services. Select your role to continue.
      </div>
      <div style={styles.buttonContainer}>
        <button
          style={{ ...styles.button, ...styles.employerButton }}
          onClick={() => handleSelect("employer")}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          I'm an Employer
        </button>
        <button
          style={{ ...styles.button, ...styles.employeeButton }}
          onClick={() => handleSelect("employee")}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          I'm an Employee
        </button>
      </div>
    </div>
  );
}