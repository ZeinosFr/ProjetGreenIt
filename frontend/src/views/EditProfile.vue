<template>
    <div class="edit-profile">
      <h2>Edit My Profile</h2>
  
      <form @submit.prevent="updateProfile" class="form-container">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" required />
        </div>
  
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>
  
        <button type="submit" class="primary-button">Update Profile</button>
      </form>
  
      <p v-if="message" class="message">{{ message }}</p>
  
      <button @click="deleteAccount" class="danger-button">
        Delete My Account
      </button>
    </div>
  </template>
  
  <script>
  import { baseURL } from '@/config';

  export default {
    data() {
      return {
        username: '',
        email: '',
        message: ''
      }
    },
    mounted() {
      this.fetchMyProfile();
    },
    methods: {
      async fetchMyProfile() {
        try {
          const response = await fetch(`${baseURL}/api/users/me`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          this.username = data.Username;
          this.email = data.Email;
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      },
      async updateProfile() {
        try {
          const response = await fetch(`${baseURL}/api/users/me`, {
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: this.username,
              email: this.email
            })
          });
  
          const data = await response.json();
          if (response.ok) {
            this.message = 'Profile updated successfully!';
          } else {
            this.message = data.message || 'Failed to update profile.';
          }
        } catch (error) {
          console.error('Error updating profile:', error);
          this.message = 'Server error.';
        }
      },
      async deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
          try {
            const response = await fetch(`${baseURL}/api/users/me`, {
              method: 'DELETE',
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
              }
            });
  
            if (response.ok) {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              this.$router.push('/auth');
            } else {
              const data = await response.json();
              this.message = data.message || 'Failed to delete account.';
            }
          } catch (error) {
            console.error('Error deleting account:', error);
            this.message = 'Server error.';
          }
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .edit-profile {
    max-width: 500px;
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
  
  .form-container {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #34495e;
  }
  
  .form-group input {
    width: 100%;
    max-width: 100%;
    padding: 10px 15px;
    border: 2px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
    box-sizing: border-box; /* Très important pour ne pas dépasser ! */
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #3498db;
  }
  
  .primary-button {
    margin-top: 10px;
    padding: 12px;
    width: 100%;
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .primary-button:hover {
    background: linear-gradient(135deg, #2980b9, #1f6399);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  .danger-button {
    margin-top: 20px;
    padding: 12px;
    width: 100%;
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .danger-button:hover {
    background: linear-gradient(135deg, #c0392b, #a83224);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  .message {
    text-align: center;
    margin-top: 20px;
    color: #27ae60;
    font-weight: bold;
  }
  </style>
  