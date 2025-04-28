/*
const db = require('../config/db');
const moment = require('moment'); // Librairie pour gérer les dates

// Fonction pour ajouter une transaction récurrente
const addRecurringTransaction = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupérer l'utilisateur connecté
    const { categoryId, amount, currency, frequency, startDate, endDate, description } = req.body;

    // Vérification des champs obligatoires
    if (!categoryId || !amount || !currency || !frequency || !startDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    console.log('Adding recurring transaction for user:', userId);

    // Insertion dans la table RecurringTransactions
    const [result] = await db.execute(
      `
      INSERT INTO RecurringTransactions 
      (UserID, CategoryID, Amount, Currency, Frequency, StartDate, EndDate, Description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [userId, categoryId, amount, currency, frequency, startDate, endDate || null, description || null]
    );

    // Obtenir le RecurringID généré automatiquement
    const recurringId = result.insertId;

    console.log('Recurring transaction created with RecurringID:', recurringId);

    // Renvoi de la réponse avec le RecurringID
    res.status(201).json({
      message: 'Recurring transaction created successfully',
      recurringId: recurringId,
    });
  } catch (error) {
    console.error('Error creating recurring transaction:', error);
    res.status(500).json({ message: 'Error creating recurring transaction' });
  }
};

// Fonction pour générer les transactions récurrentes pour un utilisateur
const generateRecurringTransactionsForUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupérer l'utilisateur connecté

    console.log('Generating recurring transactions for user:', userId);

    // Récupérer toutes les transactions récurrentes actives de l'utilisateur
    const [recurringTransactions] = await db.execute(
      `
      SELECT * 
      FROM RecurringTransactions
      WHERE UserID = ? AND (EndDate IS NULL OR EndDate >= CURDATE())
      `,
      [userId]
    );

    if (recurringTransactions.length === 0) {
      return res.status(404).json({ message: 'No active recurring transactions found' });
    }

    const newTransactions = [];

    for (const recurring of recurringTransactions) {
      const { RecurringID, CategoryID, Amount, Currency, Frequency, StartDate, EndDate } = recurring;

      // Dernière transaction générée pour cette transaction récurrente
      const [lastTransaction] = await db.execute(
        `
        SELECT MAX(Date) AS LastDate
        FROM Transactions
        WHERE RecurringID = ?
        `,
        [RecurringID]
      );

      const lastDate = lastTransaction[0]?.LastDate || StartDate;
      const currentDate = moment();
      let nextDate = moment(lastDate).add(1, Frequency.toLowerCase()); // Calcule la prochaine date

      console.log('Starting date generation for RecurringID:', RecurringID);
      console.log('Last date:', lastDate, 'Next date:', nextDate.format('YYYY-MM-DD'));

      // Génération des transactions jusqu'à aujourd'hui ou EndDate
      while (nextDate.isSameOrBefore(currentDate) && (!EndDate || nextDate.isSameOrBefore(EndDate))) {
        console.log('Inserting transaction on date:', nextDate.format('YYYY-MM-DD'));

        // Insérer la nouvelle transaction avec RecurringID
        const [transactionResult] = await db.execute(
          `
          INSERT INTO Transactions (UserID, CategoryID, Amount, Currency, Date, Description, RecurringID)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [userId, CategoryID, Amount, Currency, nextDate.format('YYYY-MM-DD'), 'Generated Recurring Transaction', RecurringID]
        );

        // Ajouter aux nouvelles transactions générées
        newTransactions.push({
          transactionId: transactionResult.insertId,
          userId,
          categoryId: CategoryID,
          amount: Amount,
          currency: Currency,
          date: nextDate.format('YYYY-MM-DD'),
          recurringId: RecurringID,
        });

        // Passer à la prochaine date
        nextDate = nextDate.add(1, Frequency.toLowerCase());
        
        // Log pour vérifier l'évolution de nextDate
        console.log('Next date after addition:', nextDate.format('YYYY-MM-DD'));
      }
    }

    console.log('Recurring transactions generated:', newTransactions);

    res.status(200).json({
      message: 'Recurring transactions generated successfully',
      transactions: newTransactions,
    });
  } catch (error) {
    console.error('Error generating recurring transactions:', error);
    res.status(500).json({ message: 'Error generating recurring transactions' });
  }
};

// Suppression d'une transaction récurrente
const deleteRecurringTransaction = async (req, res) => {
  try {
    const { id } = req.params; // ID de la transaction récurrente à supprimer

    // Vérifier si la transaction existe
    const recurringTransaction = await RecurringTransaction.findById(id);
    if (!recurringTransaction) {
      return res.status(404).json({ message: 'Transaction récurrente non trouvée' });
    }

    // Supprimer la transaction récurrente
    await RecurringTransaction.findByIdAndDelete(id);

    // Répondre à la requête
    return res.status(200).json({ message: 'Transaction récurrente supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la transaction récurrente:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};


module.exports = {
  addRecurringTransaction,
  generateRecurringTransactionsForUser,
  deleteRecurringTransaction,
};

*/