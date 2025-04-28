/*
const express = require('express');
const {
  addRecurringTransaction,
  generateRecurringTransactionsForUser,
  deleteRecurringTransaction,
} = require('../controllers/recurringTransactionController');
const authenticateUser = require('../middleware/authMiddleware'); // Middleware pour vérifier l'authentification

const router = express.Router();

// Route POST : ajouter une transaction récurrente
router.post('/', authenticateUser, addRecurringTransaction);

// Route GET : générer les transactions récurrentes pour un utilisateur
router.get('/generate', authenticateUser, generateRecurringTransactionsForUser);

router.delete('/recurring/:id', deleteRecurringTransaction);


module.exports = router;

*/