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

          <!-- Link only for Admin -->
          <router-link v-if="role === 'Admin'" to="/admin/users" class="manage-users-link">
            Manage Users
          </router-link>
        </div>
        
        <button @click="toggleAuth" :class="['auth-btn', isAuthenticated ? 'logout' : 'login']">
          {{ isAuthenticated ? 'Logout' : 'Login' }}
        </button>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script>
import { baseURL } from '@/config'
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
      logoutMessage: ''
    };
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
    },
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
    },
  },
  created() {
    if (this.isAuthenticated) {
      this.fetchUserDetails();
    }
  },
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

</style>
