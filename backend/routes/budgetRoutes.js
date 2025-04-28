const express = require('express');
const router = express.Router();
const { createBudget, getBudgets, deleteBudget } = require('../controllers/budgetController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Créer un budget
router.post('/', authenticateUser, createBudget);

// Obtenir les budgets d’un utilisateur
router.get('/', authenticateUser, getBudgets);

// Supprimer un budget
router.delete('/:id', authenticateUser, deleteBudget);

module.exports = router;
