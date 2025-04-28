<template>
  <div id="app">
    <header>
      <nav>
        <div class="left-section">
          <span v-if="isAuthenticated">
            Hello, 
            <router-link to="/edit-profile" class="profile-link">{{ username }}</router-link>
          </span>
        </div>

        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/budgets" class="nav-link">Budgets</router-link>
          <router-link to="/transactions" class="nav-link">Transactions</router-link>
          <router-link to="/categories" class="nav-link">Categories</router-link>

          <router-link v-if="role === 'Admin'" to="/admin/users" class="manage-users-link">
            Manage Users
          </router-link>
        </div>
        
        <button @click="toggleAuth" :class="['auth-btn', isAuthenticated ? 'logout' : 'login']">
          {{ isAuthenticated ? 'Logout' : 'Login' }}
        </button>
      </nav>
    </header>

    <!-- Affichage des émissions CO2 -->
    <section class="co2-tracker">
      <h3>CO₂ Emission Tracker</h3>
      <ul>
        <li v-for="(entry, index) in requests" :key="index">
          {{ entry.method }} {{ entry.url }} → {{ entry.co2.toFixed(6) }} g CO₂
        </li>
      </ul>
      <p v-if="requests.length">
        Total CO₂ emitted: <strong>{{ totalCO2.toFixed(6) }}</strong> g
      </p>
    </section>

    <main>
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script>
import { baseURL } from '@/config';
import Footer from './components/Footer.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Footer,
  },
  data() {
    return {
      isAuthenticated: localStorage.getItem('token') !== null,
      username: '',
      role: '',
      logoutMessage: '',
      requests: [] // liste de toutes les requêtes capturées
    };
  },
  computed: {
    totalCO2() {
      return this.requests.reduce((sum, r) => sum + r.co2, 0);
    }
  },
  methods: {
    async fetchUserDetails() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${baseURL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.username = response.data.Username;
          this.role = response.data.Role;
          localStorage.setItem('username', this.username);
          localStorage.setItem('role', this.role);
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        this.username = '';
        this.role = '';
      }
    },
    toggleAuth() {
      if (this.isAuthenticated) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        this.isAuthenticated = false;
        this.username = '';
        this.role = '';
        this.logoutMessage = 'Logged out successfully!';
        this.$router.push('/auth');
      } else {
        this.$router.push('/auth');
      }
    }
  },
  watch: {
    '$route'() {
      this.isAuthenticated = localStorage.getItem('token') !== null;
      if (this.isAuthenticated) {
        this.fetchUserDetails();
      } else {
        this.username = '';
        this.role = '';
      }
    }
  },
  created() {
    if (this.isAuthenticated) {
      this.fetchUserDetails();
    }

    // Intercepteur global pour calculer CO2 pour chaque réponse API
    axios.interceptors.response.use(response => {
      const contentLength = response.headers['content-length'] || 0;
      const sizeInKB = contentLength / 1024;
      const estimatedCO2 = sizeInKB * 0.00176;

      this.requests.push({
        url: response.config.url,
        method: response.config.method.toUpperCase(),
        co2: estimatedCO2
      });

      return response;
    }, error => {
      return Promise.reject(error);
    });
  }
};
</script>

<style scoped>
.profile-link {
  color: #3498db;
  text-decoration: none;
  margin-left: 5px;
  font-weight: bold;
}

.profile-link:hover {
  text-decoration: underline;
}

#app {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  background-color: #f4f7fc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: #2a3d5a;
  color: white;
  padding: 1.5em 2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

nav {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.left-section {
  font-size: 1.1rem;
  margin-right: 2em;
  color: white;
}

.nav-links {
  display: flex;
  justify-content: center;
  gap: 2em;
}

.nav-link {
  text-decoration: none;
  color: white;
  font-size: 1.1em;
  padding: 0.6em;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #4C8BF5;
}

.manage-users-link {
  background-color: transparent;
  color: #4C8BF5;
  font-weight: bold;
  padding: 0.6em 1em;
  transition: all 0.3s ease;
  font-size: 1.05em;
}

.manage-users-link:hover {
  color: white;
  transform: translateY(-2px);
}

.auth-btn {
  padding: 0.8em 1.5em;
  background-color: transparent;
  color: white;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.auth-btn.login {
  color: green;
}

.auth-btn.logout {
  color: red;
}

.auth-btn.login:hover {
  border-color: green;
}

.auth-btn.logout:hover {
  border-color: red;
}

main {
  padding: 2em;
  flex-grow: 1;
}

/* CO2 tracker style */
.co2-tracker {
  background-color: #eaf6f6;
  padding: 1rem;
  margin: 1rem;
  border-radius: 8px;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.co2-tracker h3 {
  margin-bottom: 0.5em;
  color: #2d3436;
}

.co2-tracker ul {
  padding-left: 1.2em;
}

.co2-tracker li {
  margin-bottom: 0.4em;
  font-size: 1rem;
  color: #34495e;
}

.co2-tracker p {
  margin-top: 1em;
  font-weight: bold;
  color: #27ae60;
}
</style>
