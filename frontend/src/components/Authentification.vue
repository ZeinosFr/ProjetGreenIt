<template>
  <div class="auth-container">
    <h2>{{ isRegistering ? 'Créer un compte' : 'Se connecter' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">
        {{ isRegistering ? 'S’inscrire' : 'Se connecter' }}
      </button>
    </form>

    <p>
      <span v-if="!isRegistering">Vous n'avez pas de compte ?</span>
      <span v-if="isRegistering">Déjà un compte ?</span>
      <button @click="toggleRegister">
        {{ isRegistering ? 'Se connecter' : 'S’inscrire' }}
      </button>
    </p>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      email: '',
      password: '',
      isRegistering: false, // Détermine si l'on est dans le mode "inscription" ou "connexion"
    };
  },
  methods: {
    toggleRegister() {
      this.isRegistering = !this.isRegistering;
    },
    async handleSubmit() {
      try {
        const response = this.isRegistering
          ? await axios.post('http://localhost:5000/api/users/register', {
              email: this.email,
              password: this.password,
            })
          : await axios.post('http://localhost:5000/api/users/login', {
              email: this.email,
              password: this.password,
            });
        
        console.log('Réponse de l\'API:', response.data);
        
        // Sauvegarder le token JWT
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.role);
        }

        // Rediriger vers la page principale (dashboard ou autre)
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Erreur:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Une erreur est survenue.');
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
</style>
