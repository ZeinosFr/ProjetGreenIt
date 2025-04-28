<template>
    <div class="admin-users">
      <h2>Manage Users</h2>
  
      <table v-if="users.length > 0">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.UserID">
            <td>{{ user.Username }}</td>
            <td>{{ user.Email }}</td>
            <td>{{ user.Role }}</td>
            <td>
              <button @click="deleteUser(user.UserID)" class="danger-button">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <p v-else>No users found.</p>
    </div>
  </template>
  
  <script>
  import { baseURL } from '@/config';
  export default {
    data() {
      return {
        users: []
      };
    },
    mounted() {
      this.checkAdmin();
      this.fetchUsers();
    },
    methods: {
      checkAdmin() {
        const role = localStorage.getItem('role');
        if (role !== 'Admin') {
          // Not an admin, redirect to Home
          this.$router.push('/');
        }
      },
      async fetchUsers() {
        try {
          const response = await fetch(`${baseURL}/api/users`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          this.users = data;
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      },
      async deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
          try {
            const response = await fetch(`${baseURL}/api/users/${userId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
              }
            });
  
            if (response.ok) {
              // Refresh the list
              this.fetchUsers();
            } else {
              console.error('Failed to delete user.');
            }
          } catch (error) {
            console.error('Error deleting user:', error);
          }
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .admin-users {
    max-width: 800px;
    margin: 40px auto;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 28px;
    color: #2c3e50;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  tr:hover {
    background-color: #f9f9f9;
  }
  
  .danger-button {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
  }
  
  .danger-button:hover {
    background: linear-gradient(135deg, #c0392b, #a83224);
    transform: translateY(-2px);
  }
  </style>
  