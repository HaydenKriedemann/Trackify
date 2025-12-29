import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import ALL routes
import authRoutes from './routes/auth.js';
import companyRoutes from './routes/companies.js';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';

dotenv.config();

console.log('🔄 Starting server...');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// Routes - ADD ALL OF THESE
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Basic route
app.get('/api', (req, res) => {
  console.log('✅ API route was hit!');
  res.json({ message: 'Trackify API is running!' });
});

const MONGODB_URI = process.env.MONGODB_URI;
console.log('🔗 Connecting to MongoDB...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
      console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
      console.log(`🏢 Companies: http://localhost:${PORT}/api/companies`);
      console.log(`👤 Users: http://localhost:${PORT}/api/users`);
      console.log(`📅 Events: http://localhost:${PORT}/api/events`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
  