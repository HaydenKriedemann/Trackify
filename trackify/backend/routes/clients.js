// backend/routes/clients.js
const express = require('express');
const router = express.Router();

// GET /api/clients
router.get('/', (req, res) => {
    res.json([{ id: 1, name: 'Test Client' }]);
});

// POST /api/clients  
router.post('/', (req, res) => {
    res.json({ success: true, id: Date.now() });
});

module.exports = router;