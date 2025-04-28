<template>
  <div class="dashboard">
    <!-- Header Section -->
    <header class="dashboard-header">
      <h1>Personal Dashboard</h1>
      <p class="intro-text">Track and manage your financial health in one place.</p>
    </header>

    <!-- Summary Section -->
    <section class="section summary-section">
      <h2>About you</h2>
      <div class="summary-details">
        <p><strong>Total Budgets:</strong> {{ budgets.length }}</p>
        <p><strong>Total Transactions:</strong> {{ totalTransactions }}</p>
        <p><strong>Categories:</strong> {{ categories.length }}</p>
      </div>
    </section>


    <!-- Income and Expense Summary -->
    <section class="section income-expense-section">
      <h2>Financial Summary</h2>
      <div class="currency-selector">
        <label for="currency-select">Select Currency:</label>
        <select
          id="currency-select"
          v-model="summary.currency"
          @change="fetchSummary"
        >
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </div>
      <div class="summary-container">
        <div class="summary-card income-summary">
          <h3>Total Income</h3>
          <p>{{ summary.convertedTotalIncome }} {{ summary.currency }}</p>
        </div>
        <div class="summary-card expense-summary">
          <h3>Total Expense</h3>
          <p>{{ summary.convertedTotalExpense }} {{ summary.currency }}</p>
        </div>
      </div>
    </section>

    <!-- Budgets Section -->
    <section class="section budgets-section">
      <h2>Your Budgets</h2>
      <div v-if="budgets.length > 0" class="budgets-list">
        <ul>
          <li v-for="budget in budgets" :key="budget.BudgetID" class="budget-item">
            <div class="budget-info">
              <h3>{{ budget.BudgetName }}</h3>
              <p><strong>Total Amount:</strong> {{ budget.ConvertedBudgetAmount }} {{ selectedCurrency }}</p>
              <p><strong>Remaining:</strong> {{ budget.ConvertedRemainingBudget }} {{ selectedCurrency }}</p>
            </div>
            <div class="progress-bar">
              <div
                class="progress"
                :style="{ width: calculateBudgetUsage(budget) + '%' }"
              ></div>
            </div>
          </li>
        </ul>
      </div>
      <p v-else>No budgets available.</p>
    </section>

    <!-- Transactions Section -->
    <section class="section transactions-section" v-if="transactions.length > 0">
      <h2>Recent Transactions</h2>
      <ul class="transaction-list">
        <li
          v-for="transaction in transactions"
          :key="transaction.TransactionID"
          class="transaction-item"
        >
          <div class="transaction-details">
            <span class="description">{{ transaction.Description || "No description" }}</span>
            <span class="date">{{ formatDate(transaction.Date) }}</span>
            <span
              class="amount"
              :class="getCategoryType(transaction.CategoryID) === 'Expense' ? 'Expense' : 'Income'"
            >
              {{ formatTransactionAmount(transaction) }}
            </span>
          </div>
        </li>
      </ul>
    </section>

    <!-- Message if no transactions -->
    <section v-else>
      <p>No transactions found.</p>
    </section>

    <!-- Categories Section -->
    <section class="section categories-section">
      <div v-if="categories.length > 0" class="categories-columns">
        <div class="column">
          <h3>Income Categories</h3>
          <ul>
            <li
              v-for="category in categories.filter((cat) => cat.Type === 'Income')"
              :key="category.CategoryID"
              class="category-item income"
            >
              <span>{{ category.Name }}</span>
            </li>
          </ul>
        </div>
        <div class="column">
          <h3>Expense Categories</h3>
          <ul>
            <li
              v-for="category in categories.filter((cat) => cat.Type === 'Expense')"
              :key="category.CategoryID"
              class="category-item expense"
            >
              <span>{{ category.Name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <p v-else>No categories available.</p>
    </section>

    <section class="section update-rates-section">
      <h2>Exchange Rates</h2>
      <button @click="updateExchangeRates" class="update-button">
        Update Exchange Rates
      </button>
      <table>
        <thead>
          <tr>
            <th>Currency</th>
            <th>Exchange Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="currency in exchangeRates" :key="currency.CurrencyCode">
            <td>{{ currency.CurrencyCode }}</td>
            <td>{{ currency.ExchangeRate }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    
  </div>
</template>

<script>
import axios from "axios";
import { baseURL } from '@/config';

export default {
  data() {
    return {
      transactions: [],
      totalTransactions : 0,
      budgets: [],
      categories: [],
      selectedCurrency: "EUR", // Currency for budgets
      currencies: ["USD", "EUR", "THB", "CAD", "INR", "AUD", "CNY", "JPY"],
      exchangeRates: [],
      
      summary: {
        totalIncome: 0,
        totalExpense: 0,
        convertedTotalIncome: 0,
        convertedTotalExpense: 0,
        currency: "EUR", // Currency for financial summary
      },
    };
  },
  created() {
    this.fetchTransactions();
    this.fetchBudgets();
    this.fetchCategories();
    this.fetchSummary();
    this.fetchExchangeRates();
  },
  methods: {
    async fetchTransactions() {
      try {
        const response = await axios.get(`${baseURL}/api/transactions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.transactions = response.data.slice(response.data.length-5, response.data.length);
        this.totalTransactions  = response.data.length;
      } catch (error) {
      }
    },
    async fetchBudgets() {
      try {
        const response = await axios.get(`${baseURL}/api/budgets/reports`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: { currency: this.selectedCurrency },
        });
        this.budgets = response.data;
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get(`${baseURL}/api/categories`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async updateExchangeRates() {
      try {
        const response = await axios.post(`${baseURL}/api/currency/update-rates`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("Exchange rates updated successfully!");
      } catch (error) {
        console.error("Error updating exchange rates:", error);
        alert("Failed to update exchange rates. Please try again.");
      }

      this.fetchExchangeRates();
    },
    async fetchSummary() {
      try {
        const response = await axios.get(`${baseURL}/api/budgets/summary`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: { currency: this.summary.currency }, // Only financial summary uses this currency
        });
        this.summary = response.data;
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    },
    async fetchExchangeRates() {
      try {
        const response = await axios.get(`${baseURL}/api/currency`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.exchangeRates = response.data; // Store the fetched data
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    },
    formatDate(date) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(date).toLocaleDateString("en-US", options);
    },
    calculateBudgetUsage(budget) {
      const total = budget.ConvertedBudgetAmount;
      const remaining = budget.ConvertedRemainingBudget;
      if (total === 0) return 0;
      return ((total - remaining) / total) * 100;
    },
    getCategoryType(transactionCategoryId) {
      const category = this.categories.find(
        (cat) => cat.CategoryID === transactionCategoryId
      );
      return category ? category.Type : null;
    },
    formatTransactionAmount(transaction) {
      const categoryType = this.getCategoryType(transaction.CategoryID);
      const symbol = categoryType === "Expense" ? "- " : "+ ";
      return `${symbol}${Math.abs(transaction.Amount)} ${transaction.Currency}`;
    },
  },
};
</script>

<style scoped>
/* Dashboard Styles */
.dashboard {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  padding: 3em;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header Style */
.dashboard-header {
  background-color: #2e3b4e;
  color: white;
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 3em;
}

.dashboard-header h1 {
  font-size: 2.8em;
  font-weight: 700;
  margin-bottom: 0.5em;
}

.intro-text {
  font-size: 1.3em;
  color: #aaa;
  font-weight: 400;
}

/* Budgets Section */
.budgets-section {
  background-color: #ffffff;
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 3em;
}

.budgets-list {
  list-style: none;
  padding: 0;
}

.budget-item {
  background-color: #f9f9f9;
  padding: 1em;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 1em;
}

.budget-info {
  flex: 1;
}

.budget-info h3 {
  margin: 0;
  font-size: 1.2em;
  color: #333;
}

.budget-info p {
  font-size: 1em;
  color: #777;
}

/* Progress Bar */
.progress-bar {
  background-color: #e0e0e0; /* Background color for the bar */
  border-radius: 8px;
  overflow: hidden;
  height: 10px;
  margin-top: 10px;
}

.progress {
  height: 100%;
  background-color: #4CAF50; /* Fill color */
  transition: width 0.3s ease; /* Animation for filling */
}

/* Transactions Section */
.transactions-section {
  background-color: #ffffff;
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 3em;

}

.transaction-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.transaction-item {
  background-color: #f9f9f9;
  padding: 1em;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
  transition: background-color 0.3s ease;
}

.transaction-item:hover {
  background-color: #f2f2f2;
}

.transaction-details {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 1.1em;
  flex-wrap: wrap;
}

.transaction-item .description {
  font-weight: 500;
  flex: 1;
  margin-right: 10px;
}

.transaction-item .date {
  font-size: 1em;
  color: #777;
  flex: 1;
  margin-right: 10px;
}

.transaction-item .amount {
  font-size: 0.9em;
  font-weight: bold;
  text-align: right;
  flex: 1;
}

/* Transaction Amount Styles */
.amount {
  font-weight: bold;
  font-size: 1em;
}

.amount.Income {
  color: #4CAF50; /* Green for income */
}

.amount.Expense {
  color: #f44336; /* Red for expenses */
}


/* Transaction Type Classes */
.income {
  color: #4CAF50; /* Green for income */
}

.expense {
  color: #f44336; /* Red for expenses */
}

/* Additional Styles for Categories Section */
/* Categories Section */
.categories-section {
  background-color: #ffffff;
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 3em;
}

.categories-columns {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.column {
  flex: 1;
}

.column h3 {
  margin-bottom: 1em;
  font-size: 1.3em;
  color: #333;
}

.categories-list {
  list-style: none;
  padding: 0;
}

.category-item {
  background-color: #f9f9f9;
  padding: 1em;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 1em;
  font-size: 1.1em;
  font-weight: 500;
}

.category-item.income {
  background-color: #e0f7e9; /* Light green for income */
  color: #2e7d32; /* Dark green for income text */
}

.category-item.expense {
  background-color: #fdecea; /* Light red for expenses */
  color: #c62828; /* Dark red for expense text */
}

/* Summary Section */
.summary-section {
  background-color: #ffffff;
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 3em;
}

.summary-details {
  font-size: 1.2em;
  color: #333;
  display: flex;
  justify-content: space-between;
}

.summary-details p {
  margin: 0;
}

.income-expense-section {
  background-color: #ffffff;
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 3em;
}

.summary-container {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.summary-card {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 40%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-card h3 {
  margin: 0 0 10px;
  font-size: 1.5em;
}

.summary-card p {
  margin: 0;
  font-size: 1.2em;
  color: #007bff;
}

.income-summary p {
  color: #4caf50; /* Green for income */
}

.expense-summary p {
  color: #f44336; /* Red for expenses */
}

.currency-selector {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;

}

.currency-selector label {
  font-size: 1rem;
  font-weight: 500;
  color: #555;
}

.currency-selector select {
  padding: 10px 15px;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.currency-selector select:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

.currency-selector select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
/* Styles pour le bouton de mise à jour */
.update-rates-section {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.update-rates-section h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
}

/* Styles pour le bouton */
.update-button {
  background-color: #4caf50;
  color: #fff;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.update-button:hover {
  background-color: #45a049;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.update-button:active {
  background-color: #3e8e41;
  transform: scale(0.98);
}

/* Styles pour le tableau */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  font-family: 'Arial', sans-serif;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

thead {
  background-color: #2e3b4e;
  color: #fff;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  font-size: 1rem;
  font-weight: bold;
}

td {
  font-size: 0.95rem;
  color: #333;
}

tbody tr:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}
</style>
