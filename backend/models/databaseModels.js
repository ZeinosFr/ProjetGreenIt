const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Créer une connexion à la base de données MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'personal_finance_tracker'
});

// Se connecter à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connexion à la base de données MySQL réussie.');
});

// Fonction pour récupérer un utilisateur par son email
const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Users WHERE Email = ?';
    db.query(query, [email], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); // Retourne l'utilisateur trouvé (ou null si aucun)
    });
  });
};

// Fonction pour créer un nouvel utilisateur
const createUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return reject(err);
      const query = 'INSERT INTO Users (Username, Email, PasswordHash) VALUES (?, ?, ?)';
      db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
};

// Fonction pour vérifier le mot de passe
const verifyPassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Fonction pour récupérer toutes les catégories d'un utilisateur
const getCategoriesByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Categories WHERE UserID = ?';
    db.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Fonction pour créer une nouvelle catégorie
const createCategory = (userId, name, type) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO Categories (UserID, Name, Type) VALUES (?, ?, ?)';
    db.query(query, [userId, name, type], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Fonction pour récupérer toutes les transactions d'un utilisateur
const getTransactionsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT t.TransactionID, t.Amount, t.Currency, t.Date, t.Description, c.Name AS Category
      FROM Transactions t
      JOIN Categories c ON t.CategoryID = c.CategoryID
      WHERE t.UserID = ?
    `;
    db.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Fonction pour créer une nouvelle transaction
const createTransaction = (userId, categoryId, amount, currency, description) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO Transactions (UserID, CategoryID, Amount, Currency, Description) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [userId, categoryId, amount, currency, description], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Fonction pour récupérer les budgets d'un utilisateur
const getBudgetsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Budgets WHERE UserID = ?';
    db.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Fonction pour créer un budget
const createBudget = (userId, categoryId, amount, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO Budgets (UserID, CategoryID, Amount, StartDate, EndDate) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [userId, categoryId, amount, startDate, endDate], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getUserByEmail,
  createUser,
  verifyPassword,
  getCategoriesByUserId,
  createCategory,
  getTransactionsByUserId,
  createTransaction,
  getBudgetsByUserId,
  createBudget
};
