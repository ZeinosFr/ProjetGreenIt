const axios = require('axios');
const db = require('./config/db');

const API_URL = 'http://apilayer.net/api/live';
const ACCESS_KEY = 'a4ae204e234c85e7e15528e49545231b'; // Remplace avec ta clé d'API CurrencyLayer

const fetchExchangeRates = async () => {
    try {
        console.log("Fetching exchange rates from CurrencyLayer...");
        const response = await axios.get(API_URL, {
            params: {
                access_key: ACCESS_KEY,
                currencies: 'EUR,USD,THB,CAD,INR,AUD,CNY,JPY', 
                format: 1,
                source: 'EUR',
            },
        });

        if (!response.data.success) {
            throw new Error(response.data.error.info);
        }

        const rates = response.data.quotes;
        const baseCurrency = response.data.source;

        // Mettre à jour les taux de change dans la base de données
        for (const [key, rate] of Object.entries(rates)) {
            const currencyCode = key.replace(baseCurrency, ''); // Ex: USDINR -> INR
            await db.execute(
                'INSERT INTO currencies (CurrencyCode, ExchangeRate) VALUES (?, ?) ON DUPLICATE KEY UPDATE ExchangeRate = ?',
                [currencyCode, rate, rate]
            );
        }

        console.log("Exchange rates updated successfully.");
    } catch (err) {
        console.error("Error fetching exchange rates:", err.message);
    }
};

module.exports = { fetchExchangeRates };
