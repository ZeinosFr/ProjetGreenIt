const express = require('express');
const router = express.Router();
const { fetchExchangeRates } = require('../currencyLayerService');
const { authenticateUser } = require('../middleware/authMiddleware');
const db = require('../config/db');

// Rafraîchir les taux et les récupérer
router.get('/', authenticateUser, async (req, res) => {
    try {
        await fetchExchangeRates();
        const [rows] = await db.execute('SELECT * FROM currencies');
        const exchangeRates = rows.reduce((acc, row) => {
            acc[row.CurrencyCode] = row.ExchangeRate;
            return acc;
        }, {});
        res.json(exchangeRates);
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        res.status(500).send("Failed to fetch exchange rates.");
    }
});

module.exports = router;
