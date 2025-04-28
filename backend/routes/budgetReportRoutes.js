const express = require('express');
const router = express.Router();
const { getBudgetReport, getBudgetSummary } = require('../controllers/budgetReportController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Route pour obtenir le rapport de budget
router.get('/reports', authenticateUser, getBudgetReport);

// Route pour obtenir le résumé de budget
router.get('/summary', authenticateUser, getBudgetSummary);

module.exports = router;
