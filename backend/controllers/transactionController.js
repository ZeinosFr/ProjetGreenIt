const db = require('../config/db');

// Créer une transaction
const createTransaction = async (req, res) => {
  try {
    const { categoryId, amount, currency, date, description } = req.body;
    const userId = req.user.userId;

    console.log("Creating a transaction:", req.body);

    if (!categoryId || !amount || !currency || !date) {
      return res.status(400).json({ message: "All fields (categoryId, amount, currency, date) are required" });
    }

    // Vérifier la catégorie
    const categoryQuery = 'SELECT * FROM Categories WHERE (CategoryID = ? AND (UserID IS NULL OR UserID = ?))';
    const [categoryCheck] = await db.execute(categoryQuery, [categoryId, userId]);

    if (categoryCheck.length === 0) {
      return res.status(404).json({ message: "Category not found or access denied" });
    }

    let baseAmount = amount; // Par défaut, le montant de base est identique au montant initial

    if (currency !== 'EUR') { // Effectuer une conversion uniquement si la devise n'est pas EUR
      const rateQuery = 'SELECT ExchangeRate FROM currencies WHERE CurrencyCode = ?';
      const [rateResult] = await db.execute(rateQuery, [currency]);

      if (rateResult.length === 0) {
        return res.status(400).json({ message: "Currency not supported" });
      }

      const exchangeRate = parseFloat(rateResult[0].ExchangeRate);
      baseAmount = (amount / exchangeRate).toFixed(2); // Convertir en EUR
      console.log(`Converted amount: ${amount} ${currency} = ${baseAmount} EUR`);
    } else {
      console.log("No conversion needed for EUR.");
    }

    // Insérer la transaction
    const query = `
      INSERT INTO Transactions (UserID, CategoryID, Amount, BaseAmount, Currency, Date, Description) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [userId, categoryId, amount, baseAmount, currency, date, description || null]);

    console.log("Transaction created:", result);
    return res.status(201).json({ message: "Transaction created successfully", transactionId: result.insertId });
  } catch (err) {
    console.error("Error creating transaction:", err);
    return res.status(500).json({ message: "Error creating transaction" });
  }
};


// Récupérer les transactions d'un utilisateur
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currency, startDate, endDate } = req.query; // Devise cible et période
    const baseCurrency = 'EUR';

    console.log("Fetching transactions for user:", userId);
    console.log(`Fetching transactions from ${startDate} to ${endDate}`);


    // Construire la requête SQL avec des filtres de période
    let query = 'SELECT * FROM Transactions WHERE UserID = ?';
    const params = [userId];

    if (startDate && endDate) {
      query += ' AND Date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    // Récupérer les transactions
    const [transactions] = await db.execute(query, params);

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for the given criteria" });
    }

    // Si aucune devise ou la devise est égale à la devise de base, pas de conversion nécessaire
    if (!currency || currency === baseCurrency) {
      return res.status(200).json(transactions);
    }

    // Récupérer le taux de conversion
    const rateQuery = 'SELECT ExchangeRate FROM currencies WHERE CurrencyCode = ?';
    const [rateResult] = await db.execute(rateQuery, [currency]);

    if (rateResult.length === 0) {
      return res.status(400).json({ message: "Currency not supported" });
    }

    const exchangeRate = parseFloat(rateResult[0].ExchangeRate);
    console.log("Exchange rate for", currency, ":", exchangeRate);

    // Convertir les montants
    const convertedTransactions = transactions.map(transaction => ({
      ...transaction,
      Amount: (transaction.BaseAmount * exchangeRate).toFixed(2),
      Currency: currency,
    }));

    return res.status(200).json(convertedTransactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res.status(500).json({ message: "Error fetching transactions" });
  }
};


// Supprimer une transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Deleting transaction with ID:", id);

    const query = 'DELETE FROM Transactions WHERE TransactionID = ?';
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    console.log("Transaction deleted:", result);
    return res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    return res.status(500).json({ message: "Error deleting transaction" });
  }
};

module.exports = { createTransaction, getTransactions, deleteTransaction };
