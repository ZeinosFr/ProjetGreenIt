const db = require('../config/db');

// Créer une catégorie
const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body; // Utilisation de 'name' et 'type'
    const userId = req.user.userId; // Récupérer l'ID utilisateur depuis le middleware

    console.log("Received POST request to create a category:", req.body);
    console.log("User ID:", userId); // Vérifier que l'ID utilisateur est bien présent

    // Vérifier si le type de catégorie est valide
    if (type !== 'Income' && type !== 'Expense') {
      return res.status(400).json({ message: 'Invalid category type. It should be "Income" or "Expense".' });
    }

    // Vérifier si la catégorie existe déjà
    const [existingCategory] = await db.execute(
      'SELECT * FROM Categories WHERE Name = ? AND Type = ? AND UserID = ?',
      [name, type, userId]
    );

    if (existingCategory.length > 0) {
      return res.status(400).json({ message: 'Category already exists for this user' });
    }

    // Insérer la catégorie
    await db.execute(
      'INSERT INTO Categories (Name, Type, UserID) VALUES (?, ?, ?)',
      [name, type, userId]
    );

    return res.status(201).json({ message: 'Category created successfully' });
  } catch (err) {
    console.error('Error creating category:', err);
    return res.status(500).json({ message: 'Error creating category' });
  }
};

// Lister les catégories pour un utilisateur
const getCategories = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupérer l'ID utilisateur depuis le middleware

    console.log(`[GET /categories] Fetching categories for user ID: ${userId}`);

    // Récupérer les catégories spécifiques à l'utilisateur
    const [userCategories] = await db.execute(
      'SELECT * FROM Categories WHERE UserID = ?',
      [userId]
    );

    // Récupérer les catégories par défaut (sans propriétaire)
    const [defaultCategories] = await db.execute(
      'SELECT * FROM Categories WHERE UserID IS NULL'
    );

    // Combiner les catégories utilisateur et par défaut
    const categories = [...userCategories, ...defaultCategories];

    console.log(`[GET /categories] Retrieved ${categories.length} categories for user ID: ${userId}`);
    return res.status(200).json(categories);
  } catch (err) {
    console.error('[GET /categories] Error retrieving categories:', err);
    return res.status(500).json({ message: 'Error retrieving categories' });
  }
};

// Supprimer une catégorie
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params; // ID de la catégorie
    const userId = req.user.userId; // ID utilisateur depuis le middleware

    console.log(`Received DELETE request to delete category ID: ${id}`);

    // Vérifier si la catégorie appartient à l'utilisateur
    const [category] = await db.execute('SELECT * FROM Categories WHERE CategoryID = ? AND UserID = ?', [id, userId]);

    if (category.length === 0) {
      return res.status(404).json({ message: 'Category not found or does not belong to the user' });
    }

    // Supprimer la catégorie
    await db.execute('DELETE FROM Categories WHERE CategoryID = ?', [id]);

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    return res.status(500).json({ message: 'Error deleting category' });
  }
};

module.exports = { createCategory, getCategories, deleteCategory };
