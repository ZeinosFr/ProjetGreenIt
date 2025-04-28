<template>
    <div class="create-budget-container">
      <h1>Create Budget</h1>
      <form @submit.prevent="createBudget" class="budget-form">
        <div class="form-group">
          <label for="name">Budget Name:</label>
          <input type="text" id="name" v-model="budgetName" required />
        </div>
        <div class="form-group">
          <label for="amount">Amount:</label>
          <input type="number" id="amount" v-model="amount" required />
        </div>
        <div class="form-group">
          <label for="startDate">Start Date:</label>
          <input type="date" id="startDate" v-model="startDate" required />
        </div>
        <div class="form-group">
          <label for="endDate">End Date:</label>
          <input type="date" id="endDate" v-model="endDate" required />
        </div>
        <div class="form-group">
          <label for="currency">Currency:</label>
          <select v-model="selectedCurrency" required>
            <option v-for="currency in currencies" :key="currency" :value="currency">
              {{ currency }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="categories">Categories:</label>
          <select v-model="selectedCategories" multiple required>
            <option v-for="category in categories" :key="category.CategoryID" :value="category.CategoryID">
              {{ category.Name }} ({{ category.Type }})
            </option>
          </select>
        </div>
        <button type="submit" class="submit-btn">Create Budget</button>
      </form>
  
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">{{ success }}</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { baseURL } from '@/config';

  export default {
    data() {
      return {
        budgetName: '',
        amount: '',
        startDate: '',
        endDate: '',
        selectedCurrency: '',
        selectedCategories: [], // Multiple categories selected
        currencies: ['USD', 'EUR', 'THB', 'CAD', 'INR', 'AUD', 'CNY', 'JPY'],
        categories: [],
        error: '',
        success: ''
      };
    },
    mounted() {
      this.fetchCategories();
    },
    methods: {
      async fetchCategories() {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            this.error = "Please log in to view categories.";
            return;
          }
  
          const response = await axios.get(`${baseURL}/api/categories`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          this.categories = response.data;
        } catch (err) {
          console.error("Error fetching categories:", err);
          this.error = "Unable to load categories.";
        }
      },
      async createBudget() {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            this.error = "Please log in to create a budget.";
            return;
          }
  
          const response = await axios.post(
            `${baseURL}/api/budgets`,
            {
              name: this.budgetName,
              amount: this.amount,
              currency: this.selectedCurrency,
              categoryIds: this.selectedCategories, // Multiple categories selected
              startDate: this.startDate,
              endDate: this.endDate
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
  
          this.success = "Budget created successfully!";
          this.error = '';
          this.resetForm();
          this.$router.push('/budgets');
        } catch (err) {
          console.error("Error creating budget:", err);
          this.error = "Error creating budget.";
        }
      },
      resetForm() {
        this.budgetName = '';
        this.amount = '';
        this.startDate = '';
        this.endDate = '';
        this.selectedCurrency = '';
        this.selectedCategories = [];
      }
    }
  };
  </script>
  
  <style scoped>
  .create-budget-container {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Ajout d'une ombre légère */
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 28px;
}

.budget-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
  display: block;
}

.form-group input,
.form-group select {
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #68a3d6; /* Gris doux au focus */
  box-shadow: 0 0 5px rgba(104, 163, 214, 0.5); /* Légère ombre au focus */
}

.form-group select[multiple] {
  height: 150px;
  resize: none; /* Empêche la redimensionnement */
}

.submit-btn {
  background-color: #68a3d6; /* Gris doux */
  color: white;
  padding: 14px 0;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease; /* Transition fluide */
}

.submit-btn:hover {
  background-color: #4a8bb0; /* Gris plus foncé au survol */
  transform: translateY(-3px); /* Effet de décalage léger */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombrage subtil */
}

.error,
.success {
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
}

.error {
  color: #ff4d4d; /* Rouge subtil pour l'erreur */
}

.success {
  color: #28a745; /* Vert subtil pour le succès */
}

@media (min-width: 768px) {
  .create-budget-container {
    width: 80%;
  }
}

  </style>
  