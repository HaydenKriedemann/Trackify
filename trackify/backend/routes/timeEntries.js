// backend/routes/timeEntries.js
const express = require('express');
const router = express.Router();

// GET /api/time
router.get('/', (req, res) => {
    res.json([{ id: 1, hours: 2, description: 'Test work' }]);
});

// POST /api/time
router.post('/', (req, res) => {
    res.json({ success: true, id: Date.now() });
});

module.exports = router;
