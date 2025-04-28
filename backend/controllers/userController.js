const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Créer un utilisateur
const createUser = async (req, res) => {
  try {
    const { username, email, password, role = 'User' } = req.body;

    console.log("Received POST request to create a user", req.body);

    // Vérifier si l'utilisateur existe déjà
    const [result] = await db.execute('SELECT * FROM Users WHERE Email = ?', [email]);
    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur dans la base de données
    const [insertResult] = await db.execute(
      'INSERT INTO Users (Username, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    console.log('User inserted:', insertResult);

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'Error creating user' });
  }
};

// Connexion utilisateur
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Received POST request to login a user", req.body);

    // Vérifier si l'utilisateur existe
    const [result] = await db.execute('SELECT * FROM Users WHERE Email = ?', [email]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Créer un token JWT
    const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Login successful:', { token });

    // Retourner token + role
    return res.status(200).json({
      message: 'Login successful',
      token: token,
      role: user.Role,
    });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Récupérer un utilisateur connecté
const getUserById = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const userId = req.user.userId;
    console.log("Received GET request to fetch user by ID:", userId);

    const [result] = await db.execute('SELECT UserID, Username, Email, Role FROM Users WHERE UserID = ?', [userId]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(result[0]);
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Modifier ses informations utilisateur
const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email } = req.body;

    console.log("Received PUT request to update user:", req.body);

    await db.execute(
      'UPDATE Users SET Username = ?, Email = ? WHERE UserID = ?',
      [username, email, userId]
    );

    return res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ message: 'Error updating user' });
  }
};

// Supprimer son propre compte
const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log("Received DELETE request to delete user ID:", userId);

    await db.execute(
      'DELETE FROM Users WHERE UserID = ?',
      [userId]
    );

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ message: 'Error deleting user' });
  }
};

// Récupérer tous les utilisateurs (Admins seulement)
const getAllUsers = async (req, res) => {
  try {
    const [result] = await db.execute('SELECT UserID, Username, Email, Role FROM Users');
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Supprimer un utilisateur par ID (Admins seulement)
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Received DELETE request to delete user by ID:", id);

    await db.execute(
      'DELETE FROM Users WHERE UserID = ?',
      [id]
    );

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user by ID:', err);
    return res.status(500).json({ message: 'Error deleting user' });
  }
};

// Export des fonctions
module.exports = {
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  deleteUserById
};
