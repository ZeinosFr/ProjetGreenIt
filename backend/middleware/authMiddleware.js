const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authenticateUser = (req, res, next) => {
  // Récupérer le token depuis le header Authorization
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Vérifier le token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier si le token contient un userId
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token: userId is missing.' });
    }

    // Assigner le userId décodé au champ req.user pour l'utiliser dans les contrôleurs
    req.user = { userId: decoded.userId };

    // Passer au middleware suivant
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

const authorizeAdmin = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const [result] = await db.execute('SELECT Role FROM Users WHERE UserID = ?', [userId]);
    if (result.length === 0 || result[0].Role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    next();
  } catch (err) {
    console.error('Error in authorizeAdmin middleware:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {authenticateUser, authorizeAdmin};
