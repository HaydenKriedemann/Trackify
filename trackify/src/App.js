import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { ClientProvider } from "./context/ClientContext";
import { UserProvider } from "./context/UserContext";
import { EventsProvider } from "./context/EventsContext";
import { EmployeesProvider } from "./context/EmployeesContext";
import { CompaniesProvider } from "./context/CompaniesContext";
import { AuthProvider } from "./context/AuthContext"; // Add this

// Pages
import LandingPage from "./pages/LandingPage";
import EmployeeOnboarding from "./pages/EmployeeOnboarding";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployerOnboarding from "./pages/EmployerOnboarding";
import EmployerDashboard from "./pages/EmployerDashboard";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import Tasks from "./pages/Tasks";
import TimeTracking from "./pages/TimeTracking";
import Profile from "./pages/Profile";
import Employees from "./pages/Employees";
import AllClients from "./pages/AllClients";
import AllInvoices from "./pages/AllInvoices";
import EmployeeView from "./pages/EmployeeView";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"; // Add this import

function App() {
  return (
    <CompaniesProvider>
      <AuthProvider> {/* Add this wrapper */}
        <UserProvider>
          <ClientProvider>
            <EventsProvider>
              <EmployeesProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} /> {/* Add this route */}
                    <Route path="/employee-onboarding" element={<EmployeeOnboarding />} />
                    <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                    <Route path="/employer-onboarding" element={<EmployerOnboarding />} />
                    <Route path="/employer-dashboard" element={<EmployerDashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/time-tracking" element={<TimeTracking />} />
                    <Route path="/profile" element={<Profile />} />
                    
                    {/* Employer Routes */}
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/all-clients" element={<AllClients />} />
                    <Route path="/all-invoices" element={<AllInvoices />} />
                    <Route path="/employee-view/:employeeId" element={<EmployeeView />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                    
                    {/* 404 Page */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </EmployeesProvider>
            </EventsProvider>
          </ClientProvider>
        </UserProvider>
      </AuthProvider> {/* Close AuthProvider */}
    </CompaniesProvider>
  );
}

export default App;