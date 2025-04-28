const express = require('express');
const router = express.Router();
const { getCurrencies } = require('../controllers/currencyController');
const { fetchExchangeRates } = require('../currencyLayerService');
const { authenticateUser } = require('../middleware/authMiddleware');

// Route pour récupérer les devises
router.get('/', authenticateUser, getCurrencies);

// Mettre à jour les taux de change
router.post('/update-rates', authenticateUser, async (req, res) => {
    try {
        await fetchExchangeRates();
        res.status(200).send({ message: "Exchange rates updated successfully!" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
