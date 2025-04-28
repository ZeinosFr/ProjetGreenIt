const db = require('../config/db');

// Rapport détaillé des budgets avec utilisation
const getBudgetReport = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currency } = req.query;

    const baseCurrency = 'EUR';
    let exchangeRate = 1;

    if (currency && currency !== baseCurrency) {
      const [currencyRateResult] = await db.execute(
        'SELECT ExchangeRate FROM currencies WHERE CurrencyCode = ?',
        [currency]
      );
      if (currencyRateResult.length === 0) {
        return res.status(404).json({ message: 'Currency not supported or rate not available' });
      }
      exchangeRate = currencyRateResult[0].ExchangeRate;
    }

    const [result] = await db.execute(
      `
      SELECT 
        Budgets.BudgetID,
        Budgets.Name AS BudgetName,
        Budgets.Amount AS BudgetAmount,
        Budgets.StartDate,
        Budgets.EndDate,
        GROUP_CONCAT(DISTINCT Categories.Name) AS CategoryNames,
        COALESCE(SUM(Transactions.BaseAmount), 0) AS TotalSpent,
        (Budgets.Amount - COALESCE(SUM(Transactions.BaseAmount), 0)) AS RemainingBudget
      FROM Budgets
      LEFT JOIN BudgetCategories ON Budgets.BudgetID = BudgetCategories.BudgetID
      LEFT JOIN Categories ON BudgetCategories.CategoryID = Categories.CategoryID
      LEFT JOIN Transactions ON Categories.CategoryID = Transactions.CategoryID
        AND Transactions.Date BETWEEN Budgets.StartDate AND Budgets.EndDate
        AND Transactions.UserID = ?
      WHERE Budgets.UserID = ?
      GROUP BY Budgets.BudgetID
      `,
      [userId, userId]
    );

    const convertedResult = result.map(budget => ({
      ...budget,
      ConvertedBudgetAmount: (budget.BudgetAmount * exchangeRate).toFixed(2),
      ConvertedRemainingBudget: ((budget.RemainingBudget || 0) * exchangeRate).toFixed(2),
      ConvertedTotalSpent: (budget.TotalSpent * exchangeRate).toFixed(2),
      Currency: currency || baseCurrency,
    }));

    return res.status(200).json(convertedResult);
  } catch (err) {
    console.error('Error generating budget report:', err);
    return res.status(500).json({ message: 'Error generating budget report' });
  }
};


// Résumé des budgets (revenus et dépenses)
const getBudgetSummary = async (req, res) => {
  try {
    const userId = req.user.userId; // ID utilisateur authentifié
    const { startDate, endDate, currency } = req.query; // Période et devise demandées

    console.log(
      `Generating budget summary for user: ${userId}, StartDate: ${startDate}, EndDate: ${endDate}, Currency: ${currency}`
    );

    const baseCurrency = 'EUR'; // Devise par défaut
    let exchangeRate = 1; // Pas de conversion si même devise

    if (currency && currency !== baseCurrency) {
      // Récupération du taux de conversion
      const [currencyRateResult] = await db.execute(
        'SELECT ExchangeRate FROM currencies WHERE CurrencyCode = ?',
        [currency]
      );
      if (currencyRateResult.length === 0) {
        return res
          .status(404)
          .json({ message: 'Currency not supported or rate not available' });
      }
      exchangeRate = currencyRateResult[0].ExchangeRate;
      console.log(`Exchange rate from ${baseCurrency} to ${currency}:`, exchangeRate);
    }

    // Requête pour récupérer les revenus et dépenses dans la devise de base
    let sql = `
      SELECT 
        SUM(CASE WHEN Categories.Type = 'Income' THEN Transactions.BaseAmount ELSE 0 END) AS TotalIncome,
        SUM(CASE WHEN Categories.Type = 'Expense' THEN Transactions.BaseAmount ELSE 0 END) AS TotalExpense
      FROM Transactions
      JOIN Categories ON Transactions.CategoryID = Categories.CategoryID
      WHERE Transactions.UserID = ?
    `;

    const params = [userId];

    // Ajouter des filtres de dates si spécifiés
    if (startDate && endDate) {
      sql += ` AND Transactions.Date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    // Exécuter la requête SQL
    const [rows] = await db.execute(sql, params);

    console.log('Budget summary retrieved:', rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No data found for this user.' });
    }

    const summary = rows[0]; // Résultat unique
    const convertedTotalIncome = (summary.TotalIncome * exchangeRate).toFixed(2);
    const convertedTotalExpense = (summary.TotalExpense * exchangeRate).toFixed(2);

    // Résumé formaté
    return res.status(200).json({
      totalIncome: summary.TotalIncome || 0, // En devise de base
      totalExpense: summary.TotalExpense || 0, // En devise de base
      convertedTotalIncome: convertedTotalIncome, // Converti dans la devise choisie
      convertedTotalExpense: convertedTotalExpense, // Converti dans la devise choisie
      currency: currency || baseCurrency, // Devise affichée
    });
  } catch (error) {
    console.error('Error generating budget summary:', error);
    return res.status(500).json({ message: 'Error generating budget summary' });
  }
};


module.exports = { getBudgetReport, getBudgetSummary };
