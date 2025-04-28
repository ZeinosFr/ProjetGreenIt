const express = require('express');
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Lister les catégories de l'utilisateur connecté
router.get('/', authenticateUser, getCategories);

// Créer une catégorie
router.post('/', authenticateUser, createCategory);

// Supprimer une catégorie
router.delete('/:id/delete', authenticateUser, deleteCategory);

module.exports = router;
