const db = require('../config/db');

// Créer un budget
const createBudget = async (req, res) => {
    const connection = await db.getConnection(); // Récupérer une connexion pour une transaction
    try {
        const userId = req.user.userId; // Récupérer l'ID utilisateur via le middleware
        const { name, categoryIds, amount, startDate, endDate } = req.body;

        console.log('Received POST request to create a multi-category budget', req.body);
        console.log('User ID:', userId);

        if (!name || !categoryIds || !amount || !startDate || !endDate) {
            return res.status(400).json({ message: 'All fields (name, categoryIds, amount, startDate, endDate) are required' });
        }

        // Démarrer une transaction
        await connection.beginTransaction();

        // Insérer le budget dans la table Budgets
        const [budgetResult] = await connection.execute(
            'INSERT INTO Budgets (UserID, Name, Amount, StartDate, EndDate) VALUES (?, ?, ?, ?, ?)',
            [userId, name, amount, startDate, endDate]
        );
        const budgetId = budgetResult.insertId;

        console.log('Budget created with ID:', budgetId);

        // Insérer les catégories associées dans la table BudgetCategories
        for (const categoryId of categoryIds) {
            await connection.execute(
                'INSERT INTO BudgetCategories (BudgetID, CategoryID) VALUES (?, ?)',
                [budgetId, categoryId]
            );
            console.log(`Linked Category ID ${categoryId} to Budget ID ${budgetId}`);
        }

        // Valider la transaction
        await connection.commit();

        return res.status(201).json({ message: 'Budget created successfully', budgetId });
    } catch (err) {
        console.error('Error creating multi-category budget:', err);

        // Annuler la transaction en cas d'erreur
        await connection.rollback();
        return res.status(500).json({ message: 'Error creating multi-category budget' });
    } finally {
        connection.release(); // Libérer la connexion
    }
};

// Récupérer les budgets d'un utilisateur
const getBudgets = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currency } = req.query; // Option pour convertir dans une devise spécifique
        const baseCurrency = 'EUR'; // La devise de base

        console.log("Fetching budgets for user ID:", userId);

        // Récupérer les budgets
        const query = `
            SELECT 
                b.BudgetID, b.Name, b.Amount AS BaseAmount, b.StartDate, b.EndDate, 
                GROUP_CONCAT(c.CategoryID) AS Categories
            FROM Budgets b
            LEFT JOIN BudgetCategories bc ON b.BudgetID = bc.BudgetID
            LEFT JOIN Categories c ON bc.CategoryID = c.CategoryID
            WHERE b.UserID = ?
            GROUP BY b.BudgetID
        `;
        const [budgets] = await db.execute(query, [userId]);

        if (!currency || currency === baseCurrency) {
            // Si la devise demandée est la base, retourner les budgets sans conversion
            return res.status(200).json(budgets);
        }

        // Récupérer le taux de conversion pour la devise demandée
        const rateQuery = 'SELECT ExchangeRate FROM currencies WHERE CurrencyCode = ?';
        const [rateResult] = await db.execute(rateQuery, [currency]);

        if (rateResult.length === 0) {
            return res.status(400).json({ message: "Currency not supported" });
        }

        const exchangeRate = parseFloat(rateResult[0].ExchangeRate);
        console.log("Exchange rate for currency:", currency, "is", exchangeRate);

        // Convertir les montants des budgets dans la devise demandée
        const convertedBudgets = budgets.map(budget => ({
            ...budget,
            Amount: (budget.BaseAmount * exchangeRate).toFixed(2),
            Currency: currency,
        }));

        return res.status(200).json(convertedBudgets);
    } catch (err) {
        console.error("Error fetching budgets:", err);
        return res.status(500).json({ message: "Error fetching budgets" });
    }
};

// Supprimer un budget
const deleteBudget = async (req, res) => {
    try {
        const userId = req.user.userId; // Récupérer l'utilisateur connecté
        const { id } = req.params;

        console.log('Received DELETE request for budget:', id);

        // Vérifier que le budget appartient à l'utilisateur
        const [check] = await db.execute('SELECT * FROM Budgets WHERE BudgetID = ? AND UserID = ?', [id, userId]);
        if (check.length === 0) {
            return res.status(404).json({ message: 'Budget not found or access denied' });
        }

        // Supprimer le budget
        const [result] = await db.execute('DELETE FROM Budgets WHERE BudgetID = ?', [id]);

        console.log('Budget deleted:', result);
        return res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (err) {
        console.error('Error deleting budget:', err);
        return res.status(500).json({ message: 'Error deleting budget' });
    }
};


module.exports = { createBudget, getBudgets, deleteBudget };
