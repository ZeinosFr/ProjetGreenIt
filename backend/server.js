const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import des routes API
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const budgetReportRoutes = require('./routes/budgetReportRoutes');
const currencyRoutes = require('./routes/currencyRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Autoriser tout (ou mieux : mettre l'URL du frontend si besoin)
app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

app.use(bodyParser.json());

// === ROUTES API ===
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/budgets', budgetReportRoutes);
app.use('/api/currency', currencyRoutes);

// === SERVIR LE FRONTEND (dossier dist) ===
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Route fallback pour Vue Router (très important pour SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// === DÉMARRER LE SERVEUR ===
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
