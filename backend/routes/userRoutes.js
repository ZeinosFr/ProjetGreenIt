const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  deleteUserById
} = require('../controllers/userController');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

// ROUTES PUBLIQUES

router.post('/register', createUser);
router.post('/login', loginUser);

// ROUTES POUR UTILISATEURS CONNECTÉS

router.get('/me', authenticateUser, getUserById);
router.put('/me', authenticateUser, updateUser);
router.delete('/me', authenticateUser, deleteUser);

// ROUTES POUR ADMIN UNIQUEMENT

router.get('/', authenticateUser, authorizeAdmin, getAllUsers);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteUserById);

module.exports = router;
