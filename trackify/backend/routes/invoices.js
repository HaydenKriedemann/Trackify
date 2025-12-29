cd "C:\Users\kried\Documents\Trackify for Businesses\trackify\backend\routes"

# Replace invoices.js
@'
const express = require("express");
const router = express.Router();

// GET /api/invoices
router.get("/", async (req, res) => {
    res.json([{ id: 1, invoiceNumber: "INV-001", total: 100 }]);
});

// POST /api/invoices
router.post("/", async (req, res) => {
    res.json({ success: true, id: Date.now() });
});

module.exports = router;
'@ | Out-File -FilePath "invoices.js" -Encoding UTF8 -Force

echo "✅ Created simple invoices.js"