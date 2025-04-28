const db = require('../config/db');

// Récupérer toutes les devises et leurs taux
const getCurrencies = async (req, res) => {
  console.log("Request to fetch currency");
  try {
    const [currencies] = await db.execute('SELECT * FROM currencies');
    return res.status(200).json(currencies);
  } catch (err) {
    console.error('Error retrieving currencies:', err);
    return res.status(500).json({ message: 'Error retrieving currencies' });
  }
};

module.exports = { getCurrencies };
