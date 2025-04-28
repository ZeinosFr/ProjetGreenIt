<template>
  <div class="create-transaction">
    <header>
      <h1>Create New Transaction</h1>
    </header>

    <form @submit.prevent="createTransaction">
      <label for="categoryId">Category:</label>
      <select v-model="newTransaction.categoryId" required>
        <option v-for="category in categories" :key="category.CategoryID" :value="category.CategoryID">
          {{ category.Name }}
        </option>
      </select>

      <label for="amount">Amount:</label>
      <input v-model="newTransaction.amount" type="number" id="amount" required />

      <label for="currency">Currency:</label>
      <!-- Liste déroulante pour les devises -->
      <select v-model="newTransaction.currency" required>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="THB">THB</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="AUD">AUD</option>
        <option value="CNY">CNY</option>
        <option value="JPY">JPY</option>
      </select>

      <label for="date">Date:</label>
      <input v-model="newTransaction.date" type="date" id="date" required />

      <label for="description">Description:</label>
      <textarea v-model="newTransaction.description" id="description"></textarea>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { baseURL } from '@/config';
export default {
  data() {
    return {
      newTransaction: {
        categoryId: '',
        amount: '',
        currency: 'USD', // Default currency
        date: '',
        description: '',
      },
      categories: [],
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(`${baseURL}/api/categories`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Error fetching categories');
      }
    },
    async createTransaction() {
      try {
        const response = await axios.post(
          `${baseURL}/api/transactions`,
          this.newTransaction,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        alert('Transaction created successfully');
        this.$router.push('/transactions'); // Redirect back to transactions page
      } catch (error) {
        console.error('Error creating transaction:', error);
        alert('Error creating transaction');
      }
    },
  },
};
</script>

<style scoped>
.create-transaction {
  padding: 2em;
  background-color: #f4f4f9;
  font-family: 'Arial', sans-serif;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.create-transaction header {
  background-color: #68a3d6; /* Bleu doux */
  color: white;
  padding: 1.5em;
  text-align: center;
  border-radius: 8px 8px 0 0;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.create-transaction form {
  display: flex;
  flex-direction: column;
  margin-top: 2em;
}

.create-transaction label {
  margin-bottom: 0.5em;
  font-weight: 500;
  color: #555;
}

.create-transaction input,
.create-transaction select,
.create-transaction textarea {
  padding: 0.8em;
  margin-bottom: 1.2em;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  color: #333;
  background-color: #fff;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.create-transaction input:focus,
.create-transaction select:focus,
.create-transaction textarea:focus {
  border-color: #68a3d6;
  box-shadow: 0 0 6px rgba(104, 163, 214, 0.4);
  outline: none;
}

.create-transaction textarea {
  resize: none;
  height: 100px;
}

.create-transaction button {
  padding: 1em 1.5em;
  background-color: #68a3d6; /* Bleu doux */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.create-transaction button:hover {
  background-color: #4a8bb0;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .create-transaction {
    padding: 1.5em;
    margin: 0 1em;
  }

  .create-transaction button {
    font-size: 14px;
  }
}

</style>
