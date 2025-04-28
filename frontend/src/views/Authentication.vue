<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
    <form @submit.prevent="handleSubmit" class="auth-form">
      <!-- Champ username (visible uniquement en mode Register) -->
      <div v-if="!isLogin" class="form-group">
        <label for="username">Username:</label>
        <input v-model="form.username" type="text" id="username" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input v-model="form.email" type="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input v-model="form.password" type="password" id="password" required />
      </div>
      <button type="submit" class="submit-btn">{{ isLogin ? 'Login' : 'Register' }}</button>
    </form>
    <button @click="toggleAuthMode" class="toggle-btn">
      {{ isLogin ? 'Switch to Register' : 'Switch to Login' }}
    </button>
  </div>
</template>

<script>
import axios from 'axios';
import { baseURL } from '@/config';

export default {
  name: 'Authentication',
  data() {
    return {
      isLogin: true, // Définit si on est en mode connexion ou inscription
      form: {
        username: '', // Champ pour l'inscription
        email: '',
        password: '',
      },
    };
  },
  methods: {
    toggleAuthMode() {
      this.isLogin = !this.isLogin;
    },
    async handleSubmit() {
      // Détermine l'endpoint et prépare les données pour l'API
      const endpoint = this.isLogin
        ? `${baseURL}/api/users/login`
        : `${baseURL}/api/users/register`;
      const payload = this.isLogin
        ? { email: this.form.email, password: this.form.password }
        : this.form; // Inclut username, email et password pour Register

      try {
        const response = await axios.post(endpoint, payload);
        alert('Success: ' + response.data.message);

        if (this.isLogin) {
          // Enregistrer le token dans le localStorage
          localStorage.setItem('token', response.data.token);
          // Rediriger vers Home
          this.$router.push('/');
        }
      } catch (error) {
        console.error(error);
        alert('Error: ' + (error.response?.data?.message || 'Something went wrong.'));
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #e9f2f9; /* Bleu clair */
  padding: 2em;
  box-sizing: border-box;
}

h2 {
  color: #3a506b; /* Bleu foncé */
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5em;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 2em;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5em;
}

label {
  display: block;
  font-size: 1rem;
  margin-bottom: 0.5em;
  font-weight: 600;
  color: #3a506b;
}

input {
  width: 100%;
  padding: 0.8em;
  font-size: 1rem;
  border: 1px solid #d1e1ec;
  border-radius: 6px;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.3);
  outline: none;
}

button {
  background-color: #007bff;
  color: white;
  padding: 1em;
  font-size: 1.1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button:active {
  transform: translateY(0);
}

.toggle-btn {
  margin-top: 1.5em;
  background-color: transparent;
  color: #007bff;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  text-decoration: underline;
  color: #ffffff;
}

@media (max-width: 768px) {
  .auth-container {
    padding: 1.5em;
  }

  h2 {
    font-size: 1.8rem;
  }

  .auth-form {
    padding: 1.5em;
  }

  button {
    font-size: 1rem;
  }
}

</style>
