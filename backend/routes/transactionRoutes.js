const express = require('express');
const router = express.Router();
const { createTransaction, getTransactions, deleteTransaction } = require('../controllers/transactionController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Créer une transaction
router.post('/', authenticateUser, createTransaction);

// Récupérer les transactions d'un utilisateur
router.get('/', authenticateUser, getTransactions);

// Supprimer une transaction
router.delete('/:id', authenticateUser, deleteTransaction);

module.exports = router;
