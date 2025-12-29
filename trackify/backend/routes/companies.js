import express from 'express';
import Company from '../models/Company.js';
import User from '../models/User.js';

const router = express.Router();

// Get all companies (REAL DATA ONLY)
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find()
      .populate('owner', 'firstName lastName email')
      .populate('employees', 'firstName lastName email position');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('owner', 'firstName lastName email')
      .populate('employees', 'firstName lastName email position department');
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search companies
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const companies = await Company.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('name email phone industry address');
    
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;