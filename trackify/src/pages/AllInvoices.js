// src/pages/AllInvoices.js - TOP SECTION
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AllInvoices.css';

const AllInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        totalAmount: 0,
        draft: { count: 0, amount: 0 },
        sent: { count: 0, amount: 0 },
        paid: { count: 0, amount: 0 },
        overdue: { count: 0, amount: 0 }
    });
    
    const navigate = useNavigate();  // CHANGED from useHistory to useNavigate

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        calculateStats();
    }, [invoices]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('/api/invoices', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setInvoices(response.data);
        } catch (err) {
            console.error('Error fetching invoices:', err);
            setError(err.response?.data?.msg || 'Failed to load invoices. Please try again.');
            
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/invoices/stats/summary', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setStats(response.data.byStatus || stats);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const calculateStats = () => {
        const calculatedStats = {
            total: invoices.length,
            totalAmount: 0,
            draft: { count: 0, amount: 0 },
            sent: { count: 0, amount: 0 },
            paid: { count: 0, amount: 0 },
            overdue: { count: 0, amount: 0 }
        };

        invoices.forEach(invoice => {
            const amount = invoice.total || 0;
            calculatedStats.totalAmount += amount;
            
            const status = invoice.status?.toLowerCase() || 'draft';
            if (calculatedStats[status]) {
                calculatedStats[status].count += 1;
                calculatedStats[status].amount += amount;
            }
        });

        setStats(calculatedStats);
    };

    const deleteInvoice = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/invoices/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setInvoices(invoices.filter(invoice => invoice._id !== id));
        } catch (err) {
            alert('Failed to delete invoice: ' + (err.response?.data?.msg || err.message));
        }
    };

    const sendInvoice = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/invoices/${id}/send`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            alert('Invoice sent successfully!');
            fetchInvoices();
        } catch (err) {
            alert('Failed to send invoice: ' + (err.response?.data?.msg || err.message));
        }
    };

    const markAsPaid = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/invoices/${id}/mark-paid`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            alert('Invoice marked as paid!');
            fetchInvoices();
        } catch (err) {
            alert('Failed to mark as paid: ' + (err.response?.data?.msg || err.message));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (err) {
            return 'Invalid Date';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    const getStatusBadge = (status, dueDate) => {
        let actualStatus = status?.toLowerCase() || 'draft';
        const today = new Date();
        const due = dueDate ? new Date(dueDate) : null;
        
        // Auto-mark as overdue if due date passed and not paid
        if (actualStatus === 'sent' && due && due < today) {
            actualStatus = 'overdue';
        }

        const statusConfig = {
            'draft': { class: 'badge-secondary', text: 'Draft', icon: 'fa-edit' },
            'sent': { class: 'badge-info', text: 'Sent', icon: 'fa-paper-plane' },
            'paid': { class: 'badge-success', text: 'Paid', icon: 'fa-check-circle' },
            'overdue': { class: 'badge-danger', text: 'Overdue', icon: 'fa-exclamation-circle' }
        };
        
        const config = statusConfig[actualStatus] || { class: 'badge-light', text: actualStatus, icon: 'fa-question' };
        
        return (
            <span className={`badge ${config.class}`}>
                <i className={`fas ${config.icon} me-1`}></i>
                {config.text}
            </span>
        );
    };

    const filteredInvoices = invoices.filter(invoice => {
        // Apply status filter
        if (filter !== 'all' && invoice.status?.toLowerCase() !== filter) {
            return false;
        }
        
        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                (invoice.invoiceNumber?.toLowerCase().includes(term)) ||
                (invoice.client?.name?.toLowerCase().includes(term)) ||
                (invoice.notes?.toLowerCase().includes(term))
            );
        }
        
        return true;
    });

    const generateInvoiceNumber = () => {
        const prefix = 'INV';
        const year = new Date().getFullYear().toString().slice(-2);
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${year}${month}-${random}`;
    };

    const handleCreateNew = () => {
        const newInvoiceNumber = generateInvoiceNumber();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading your invoices...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                    <button onClick={fetchInvoices} className="btn btn-sm btn-outline-danger ms-3">
                        <i className="fas fa-redo me-1"></i> Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="invoices-container">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <i className="fas fa-file-invoice-dollar me-2"></i>
                        Invoices
                    </h1>
                    <p className="text-muted">Manage and track all your invoices</p>
                </div>
                
                <div className="header-actions">
                    <div className="search-box">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search invoices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button 
                                    className="btn btn-outline-secondary" 
                                    onClick={() => setSearchTerm('')}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <button onClick={handleCreateNew} className="btn btn-success">
                        <i className="fas fa-plus me-2"></i> New Invoice
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card total-revenue">
                    <div className="stat-icon">
                        <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Total Revenue</h3>
                        <p className="stat-value">{formatCurrency(stats.totalAmount)}</p>
                        <p className="stat-desc">{stats.total} invoices</p>
                    </div>
                </div>
                
                <div className="stat-card outstanding">
                    <div className="stat-icon">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Outstanding</h3>
                        <p className="stat-value">{formatCurrency(stats.sent.amount + stats.overdue.amount)}</p>
                        <p className="stat-desc">{stats.sent.count + stats.overdue.count} invoices</p>
                    </div>
                </div>
                
                <div className="stat-card overdue">
                    <div className="stat-icon">
                        <i className="fas fa-exclamation-circle"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Overdue</h3>
                        <p className="stat-value">{formatCurrency(stats.overdue.amount)}</p>
                        <p className="stat-desc">{stats.overdue.count} invoices</p>
                    </div>
                </div>
                
                <div className="stat-card paid">
                    <div className="stat-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Paid</h3>
                        <p className="stat-value">{formatCurrency(stats.paid.amount)}</p>
                        <p className="stat-desc">{stats.paid.count} invoices</p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs mb-4">
                <div className="btn-group" role="group">
                    <button 
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({invoices.length})
                    </button>
                    <button 
                        className={`btn ${filter === 'draft' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('draft')}
                    >
                        Draft ({stats.draft.count})
                    </button>
                    <button 
                        className={`btn ${filter === 'sent' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('sent')}
                    >
                        Outstanding ({stats.sent.count})
                    </button>
                    <button 
                        className={`btn ${filter === 'paid' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('paid')}
                    >
                        Paid ({stats.paid.count})
                    </button>
                    <button 
                        className={`btn ${filter === 'overdue' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('overdue')}
                    >
                        Overdue ({stats.overdue.count})
                    </button>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="card">
                <div className="card-body">
                    {filteredInvoices.length === 0 ? (
                        <div className="empty-state text-center py-5">
                            <div className="empty-state-icon mb-4">
                                <i className="fas fa-file-invoice fa-4x text-muted"></i>
                            </div>
                            <h3>No invoices found</h3>
                            <p className="text-muted mb-4">
                                {searchTerm 
                                    ? `No invoices match "${searchTerm}"` 
                                    : filter === 'all' 
                                        ? "You haven't created any invoices yet" 
                                        : `No ${filter} invoices found`
                                }
                            </p>
                            {!searchTerm && (
                                <button onClick={handleCreateNew} className="btn btn-primary btn-lg">
                                    <i className="fas fa-plus me-2"></i> Create Your First Invoice
                                </button>
                            )}
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')} 
                                    className="btn btn-outline-primary"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Invoice #</th>
                                            <th>Client</th>
                                            <th>Date</th>
                                            <th>Due Date</th>
                                            <th className="text-end">Amount</th>
                                            <th>Status</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInvoices.map(invoice => (
                                            <tr key={invoice._id} className="invoice-row">
                                                <td>
                                                    <strong className="invoice-number">{invoice.invoiceNumber}</strong>
                                                    {invoice.notes && (
                                                        <div className="small text-muted mt-1">
                                                            <i className="fas fa-sticky-note me-1"></i>
                                                            {invoice.notes.substring(0, 50)}
                                                            {invoice.notes.length > 50 ? '...' : ''}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    {invoice.client ? (
                                                        <>
                                                            <div className="fw-medium">{invoice.client.name}</div>
                                                            {invoice.client.email && (
                                                                <div className="small text-muted">
                                                                    <i className="fas fa-envelope me-1"></i>
                                                                    {invoice.client.email}
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-muted">No client assigned</span>
                                                    )}
                                                </td>
                                                <td>{formatDate(invoice.date)}</td>
                                                <td className={invoice.status === 'overdue' ? 'text-danger fw-bold' : ''}>
                                                    {formatDate(invoice.dueDate)}
                                                    {invoice.status === 'overdue' && (
                                                        <div className="small">Overdue</div>
                                                    )}
                                                </td>
                                                <td className="text-end fw-bold">
                                                    {formatCurrency(invoice.total)}
                                                    {invoice.items?.length > 0 && (
                                                        <div className="small text-muted">
                                                            {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    {getStatusBadge(invoice.status, invoice.dueDate)}
                                                </td>
                                                <td>
                                                    <div className="btn-group btn-group-sm" role="group">
                                                        <Link 
                                                            to={`/invoices/${invoice._id}`} 
                                                            className="btn btn-outline-primary"
                                                            title="View"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </Link>
                                                        <Link 
                                                            to={`/invoices/${invoice._id}/edit`} 
                                                            className="btn btn-outline-secondary"
                                                            title="Edit"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </Link>
                                                        {invoice.status === 'draft' && (
                                                            <button 
                                                                onClick={() => sendInvoice(invoice._id)}
                                                                className="btn btn-outline-success"
                                                                title="Send Invoice"
                                                            >
                                                                <i className="fas fa-paper-plane"></i>
                                                            </button>
                                                        )}
                                                        {invoice.status === 'sent' && (
                                                            <button 
                                                                onClick={() => markAsPaid(invoice._id)}
                                                                className="btn btn-outline-success"
                                                                title="Mark as Paid"
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => deleteInvoice(invoice._id)}
                                                            className="btn btn-outline-danger"
                                                            title="Delete"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div className="text-muted">
                                    Showing {filteredInvoices.length} of {invoices.length} invoices
                                </div>
                                <div>
                                    <button 
                                        onClick={fetchInvoices} 
                                        className="btn btn-outline-secondary btn-sm"
                                    >
                                        <i className="fas fa-sync-alt me-1"></i> Refresh
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllInvoices;