import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useClients } from "../context/ClientContext";
import { useEvents } from "../context/EventsContext";
import { useUser } from "../context/UserContext";

function Invoices() {
  const { clients } = useClients();
  const { events } = useEvents();
  const { user } = useUser();
  
  const [selectedClient, setSelectedClient] = useState(clients[0]?.id || "");
  const [invoices, setInvoices] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [companyInfo, setCompanyInfo] = useState(null);

  // Load company information
  useEffect(() => {
    // Try to get company from user context first
    if (user?.company) {
      setCompanyInfo(user.company);
    } else {
      // Fallback to localStorage (for employer)
      const savedCompany = localStorage.getItem('currentCompany');
      if (savedCompany) {
        setCompanyInfo(JSON.parse(savedCompany));
      }
    }
  }, [user]);

  // Calculate invoice for selected client and month
  useEffect(() => {
    if (selectedClient && companyInfo) {
      const clientData = clients.find(c => c.id === parseInt(selectedClient));
      if (clientData) {
        const clientEvents = events.filter(event => 
          event.client === clientData.name && 
          event.completed &&
          event.start.getMonth() === currentMonth &&
          event.start.getFullYear() === currentYear
        );

        const lineItems = clientEvents.map(event => {
          const duration = (event.end - event.start) / (1000 * 60 * 60);
          const clientRate = clients.find(c => c.name === event.client)?.hourlyRate || 75;
          const amount = duration * clientRate;
          return {
            date: event.start.toLocaleDateString(),
            description: event.title,
            hours: duration.toFixed(2),
            rate: clientRate,
            amount: amount
          };
        });

        const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
        const vat = subtotal * 0.15;
        const total = subtotal + vat;

        setInvoices(prev => ({
          ...prev,
          [selectedClient]: {
            client: clientData,
            lineItems,
            subtotal,
            vat,
            total,
            invoiceNumber: `INV-${clientData.name.slice(0, 3).toUpperCase()}-${currentYear}${String(currentMonth + 1).padStart(2, '0')}`,
            issueDate: new Date().toLocaleDateString(),
            dueDate: new Date(currentYear, currentMonth + 1, 1).toLocaleDateString(),
            company: companyInfo
          }
        }));
      }
    }
  }, [selectedClient, clients, events, currentMonth, currentYear, companyInfo]);

  const selectedInvoice = selectedClient ? invoices[selectedClient] : null;

  const downloadPDF = () => {
    if (!selectedInvoice) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${selectedInvoice.invoiceNumber}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              color: #333;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3498db;
            }
            .company-info {
              text-align: center;
              margin-bottom: 30px;
            }
            .invoice-details { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 40px;
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
            }
            .line-items { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 30px 0;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .line-items th, .line-items td { 
              border: 1px solid #ddd; 
              padding: 15px; 
              text-align: left; 
            }
            .line-items th { 
              background: #34495e; 
              color: white;
              font-weight: 600;
            }
            .line-items tr:nth-child(even) {
              background: #f8f9fa;
            }
            .totals { 
              float: right; 
              width: 300px; 
              margin-top: 30px;
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              margin: 12px 0; 
              padding-bottom: 8px;
              border-bottom: 1px solid #ddd;
            }
            .grand-total { 
              font-size: 18px; 
              font-weight: bold; 
              border-top: 2px solid #333; 
              padding-top: 15px;
              margin-top: 15px;
              color: #2c3e50;
            }
            .banking-details {
              margin-top: 50px;
              padding: 20px;
              background: #e8f4f8;
              border-radius: 8px;
              border-left: 4px solid #3498db;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #7f8c8d;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="company-info">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">${selectedInvoice.company.companyName}</h1>
            ${selectedInvoice.company.companyRegistration ? `<p><strong>Registration No:</strong> ${selectedInvoice.company.companyRegistration}</p>` : ''}
            ${selectedInvoice.company.companyVAT ? `<p><strong>VAT No:</strong> ${selectedInvoice.company.companyVAT}</p>` : ''}
          </div>

          <div class="header">
            <h1 style="color: #3498db; margin-bottom: 5px;">TAX INVOICE</h1>
            <h2 style="color: #2c3e50; margin: 5px 0;">${selectedInvoice.invoiceNumber}</h2>
          </div>
          
          <div class="invoice-details">
            <div>
              <h3>From:</h3>
              <p>
                <strong>${selectedInvoice.company.companyName}</strong><br>
                ${selectedInvoice.company.streetAddress || ''}<br>
                ${selectedInvoice.company.city || ''}${selectedInvoice.company.state ? ', ' + selectedInvoice.company.state : ''}<br>
                ${selectedInvoice.company.zipCode || ''}${selectedInvoice.company.country ? ', ' + selectedInvoice.company.country : ''}<br>
                Email: ${selectedInvoice.company.companyEmail}<br>
                Phone: ${selectedInvoice.company.companyPhone}
              </p>
            </div>
            <div>
              <h3>To:</h3>
              <p>
                <strong>${selectedInvoice.client.name}</strong><br>
                ${selectedInvoice.client.email}<br>
                ${selectedInvoice.client.phone}
              </p>
              <p><strong>Invoice Date:</strong> ${selectedInvoice.issueDate}</p>
              <p><strong>Due Date:</strong> ${selectedInvoice.dueDate}</p>
            </div>
          </div>

          <table class="line-items">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Hours</th>
                <th>Rate (R)</th>
                <th>Amount (R)</th>
              </tr>
            </thead>
            <tbody>
              ${selectedInvoice.lineItems.map(item => `
                <tr>
                  <td>${item.date}</td>
                  <td>${item.description}</td>
                  <td>${item.hours}</td>
                  <td>${item.rate.toFixed(2)}</td>
                  <td>${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>R${selectedInvoice.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>VAT (15%):</span>
              <span>R${selectedInvoice.vat.toFixed(2)}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total Due:</span>
              <span>R${selectedInvoice.total.toFixed(2)}</span>
            </div>
          </div>

          ${selectedInvoice.company.bankName ? `
          <div class="banking-details">
            <h3>Banking Details</h3>
            <p><strong>Bank:</strong> ${selectedInvoice.company.bankName}</p>
            <p><strong>Account Holder:</strong> ${selectedInvoice.company.accountHolder}</p>
            <p><strong>Account Number:</strong> ${selectedInvoice.company.accountNumber}</p>
            ${selectedInvoice.company.branchCode ? `<p><strong>Branch Code:</strong> ${selectedInvoice.company.branchCode}</p>` : ''}
            ${selectedInvoice.company.accountType ? `<p><strong>Account Type:</strong> ${selectedInvoice.company.accountType}</p>` : ''}
          </div>
          ` : ''}

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>This is an automatically generated invoice from ${selectedInvoice.company.companyName}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = [2023, 2024, 2025];

  if (!companyInfo) {
    return (
      <div className="dashboard-container">
        <Sidebar role="employee" />
        <div className="dashboard-content">
          <header className="dashboard-header">
            <h1>Monthly Invoices</h1>
            <p>Please complete company setup to generate invoices</p>
          </header>
          <div className="no-data">
            <p>Company information not found. Please contact your employer.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar role="employee" />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Monthly Invoices</h1>
          <p>Professional invoices with your company branding</p>
          {companyInfo && (
            <div style={{ 
              background: '#e8f5e8', 
              padding: '15px', 
              borderRadius: '8px', 
              marginTop: '15px',
              border: '1px solid #4caf50'
            }}>
              <strong>Issued by:</strong> {companyInfo.companyName}
            </div>
          )}
        </header>

        <div className="invoice-controls">
          <div className="form-group">
            <label>Select Client</label>
            <select 
              value={selectedClient} 
              onChange={(e) => setSelectedClient(e.target.value)}
              className="form-input"
            >
              <option value="">Choose a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Month</label>
              <select 
                value={currentMonth} 
                onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                className="form-input"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Year</label>
              <select 
                value={currentYear} 
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="form-input"
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedInvoice ? (
          <div className="invoice-preview-container">
            <div className="section-header">
              <h2>Invoice Preview - {months[currentMonth]} {currentYear}</h2>
              <div className="invoice-actions">
                <button className="secondary-btn">Email Invoice</button>
                <button onClick={downloadPDF} className="primary-btn">
                  Download PDF
                </button>
              </div>
            </div>

            <div className="invoice-paper">
              <div className="invoice-header">
                <div className="invoice-brand">
                  <h1>{selectedInvoice.company.companyName}</h1>
                  {selectedInvoice.company.companyRegistration && (
                    <p><strong>Reg No:</strong> {selectedInvoice.company.companyRegistration}</p>
                  )}
                  {selectedInvoice.company.companyVAT && (
                    <p><strong>VAT No:</strong> {selectedInvoice.company.companyVAT}</p>
                  )}
                </div>
                <div className="invoice-meta">
                  <h2>TAX INVOICE #{selectedInvoice.invoiceNumber}</h2>
                  <p><strong>Issue Date:</strong> {selectedInvoice.issueDate}</p>
                  <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
                </div>
              </div>

              <div className="invoice-parties">
                <div className="from-to">
                  <div className="party">
                    <h3>From:</h3>
                    <p>
                      <strong>{selectedInvoice.company.companyName}</strong><br />
                      {selectedInvoice.company.streetAddress && <>{selectedInvoice.company.streetAddress}<br /></>}
                      {selectedInvoice.company.city && <>{selectedInvoice.company.city}{selectedInvoice.company.state ? ', ' + selectedInvoice.company.state : ''}<br /></>}
                      {selectedInvoice.company.zipCode && <>{selectedInvoice.company.zipCode}{selectedInvoice.company.country ? ', ' + selectedInvoice.company.country : ''}<br /></>}
                      Email: {selectedInvoice.company.companyEmail}<br />
                      Phone: {selectedInvoice.company.companyPhone}
                    </p>
                  </div>
                  <div className="party">
                    <h3>To:</h3>
                    <p>
                      <strong>{selectedInvoice.client.name}</strong><br />
                      {selectedInvoice.client.email}<br />
                      {selectedInvoice.client.phone}
                    </p>
                  </div>
                </div>
              </div>

              <table className="invoice-line-items">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Hours</th>
                    <th>Rate (R)</th>
                    <th>Amount (R)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.lineItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>{item.description}</td>
                      <td>{item.hours}</td>
                      <td>{item.rate.toFixed(2)}</td>
                      <td>{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="invoice-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>R{selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>VAT (15%):</span>
                  <span>R{selectedInvoice.vat.toFixed(2)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total Due:</span>
                  <span>R{selectedInvoice.total.toFixed(2)}</span>
                </div>
              </div>

              {selectedInvoice.company.bankName && (
                <div className="banking-details">
                  <h3>Banking Details</h3>
                  <div className="banking-info">
                    <p><strong>Bank:</strong> {selectedInvoice.company.bankName}</p>
                    <p><strong>Account Holder:</strong> {selectedInvoice.company.accountHolder}</p>
                    <p><strong>Account Number:</strong> {selectedInvoice.company.accountNumber}</p>
                    {selectedInvoice.company.branchCode && (
                      <p><strong>Branch Code:</strong> {selectedInvoice.company.branchCode}</p>
                    )}
                    {selectedInvoice.company.accountType && (
                      <p><strong>Account Type:</strong> {selectedInvoice.company.accountType}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="invoice-footer">
                <p>Thank you for your business! This is an automatically generated invoice.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-invoice">
            <p>Select a client to view their monthly invoice</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Invoices;