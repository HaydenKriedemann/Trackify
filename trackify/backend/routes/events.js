import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// Create event (for invoices)
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    
    // Populate employee and company details
    await event.populate('employee', 'firstName lastName');
    await event.populate('company', 'name email');
    
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get events for invoice generation
router.get('/company/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const { month, year, client } = req.query;
    
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, parseInt(month) + 1, 0);
    
    let query = { 
      company: companyId,
      start: { $gte: startDate, $lte: endDate },
      completed: true
    };
    
    if (client) {
      query.client = client;
    }
    
    const events = await Event.find(query)
      .populate('employee', 'firstName lastName')
      .populate('company', 'name email phone address banking');
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;