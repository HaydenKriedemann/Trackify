// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import ALL your route files
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const timeEntryRoutes = require('./routes/timeEntries');
const invoiceRoutes = require('./routes/invoices');
const companyRoutes = require('./routes/companies');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Database connection
const connectDB = async () => {
    try {
        // Use MONGODB_URI from .env or local MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trackify';
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('⚠️  Running without database connection');
    }
};

connectDB();

// Define ALL API routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/time', timeEntryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Trackify API is running',
        timestamp: new Date().toISOString()
    });
});

// Test all routes
app.get('/api/test', (req, res) => {
    res.json({
        message: 'All routes are working',
        routes: [
            '/api/auth',
            '/api/clients', 
            '/api/time',
            '/api/invoices',
            '/api/companies',
            '/api/events',
            '/api/users'
        ]
    });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        msg: 'Something went wrong!', 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        msg: 'Route not found',
        path: req.originalUrl 
    });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 Test routes: http://localhost:${PORT}/api/test`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

module.exports = app;