import React, { createContext, useState, useContext, useEffect } from 'react';

const CompaniesContext = createContext();

export function useCompanies() {
  return useContext(CompaniesContext);
}

export function CompaniesProvider({ children }) {
  const [companies, setCompanies] = useState([]);

  // Load companies from localStorage on startup
  useEffect(() => {
    const savedCompanies = localStorage.getItem('trackify-companies');
    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies));
    }
  }, []);

  const addCompany = (companyData) => {
    const newCompany = {
      ...companyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      employees: []
    };
    
    const updatedCompanies = [...companies, newCompany];
    setCompanies(updatedCompanies);
    localStorage.setItem('trackify-companies', JSON.stringify(updatedCompanies));
    
    // Also set as current company for the employer
    localStorage.setItem('currentCompany', JSON.stringify(newCompany));
  };

  const addEmployeeToCompany = (companyId, employeeData) => {
    const updatedCompanies = companies.map(company => {
      if (company.id === companyId) {
        return {
          ...company,
          employees: [...company.employees, employeeData]
        };
      }
      return company;
    });
    
    setCompanies(updatedCompanies);
    localStorage.setItem('trackify-companies', JSON.stringify(updatedCompanies));
  };

  const value = {
    companies,
    addCompany,
    addEmployeeToCompany
  };

  return (
    <CompaniesContext.Provider value={value}>
      {children}
    </CompaniesContext.Provider>
  );
}