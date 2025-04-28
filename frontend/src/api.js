import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL de ton serveur backend
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}` // Utiliser le token JWT stocké
  }
});

export default api;
