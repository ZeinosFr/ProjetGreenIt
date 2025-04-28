<template>
    <div class="budgets-container">
      <h1>Your Budgets</h1>
      <div class="currency-selector">
        <label for="currency-select">Select Currency:</label>
        <select id="currency-select" v-model="selectedCurrency" @change="fetchBudgets">
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </div>
      <ul class="budgets-list">
        <li v-for="budget in budgets" :key="budget.BudgetID" class="budget-item">
          <div class="budget-info">
            <h2>{{ budget.BudgetName }}</h2>
            <p><strong>Amount:</strong> {{ budget.ConvertedBudgetAmount }} {{ budget.Currency }}</p>
            <p><strong>Remaining:</strong> {{ budget.ConvertedRemainingBudget }} {{ budget.Currency }}</p>
            <p><strong>Spent:</strong> {{ budget.ConvertedTotalSpent }} {{ budget.Currency }}</p>
            <p><strong>Start Date:</strong> {{ formatDate(budget.StartDate) }}</p>
            <p><strong>End Date:</strong> {{ formatDate(budget.EndDate) }}</p>
          </div>
          <div class="budget-actions">
            <button @click="deleteBudget(budget.BudgetID)" class="delete-btn">Delete</button>
          </div>
        </li>
      </ul>
      <button @click="navigateToCreateBudget" class="create-btn">Create New Budget</button>
    </div>
  </template>
  <script>
  import { useRouter } from "vue-router";
  import { ref, onMounted } from "vue";
  import { baseURL } from '@/config';

  import axios from "axios";
  
  export default {
    name: "Budgets",
    setup() {
      const router = useRouter();
      const budgets = ref([]);
      const selectedCurrency = ref("EUR");
      const currencies = ref(["USD", "EUR", "THB", "CAD", "INR", "AUD", "CNY", "JPY"]);
  
      const fetchBudgets = async () => {
        try {
          const response = await axios.get(`${baseURL}/api/budgets/reports`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              currency: selectedCurrency.value,
            },
          });
          budgets.value = response.data;
        } catch (error) {
          console.error("Error fetching budgets:", error);
        }
      };
  
      const deleteBudget = async (budgetId) => {
        try {
          const confirmDelete = window.confirm("Are you sure you want to delete this budget?");
          if (confirmDelete) {
            const response = await axios.delete(`${baseURL}/api/budgets/${budgetId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            alert(response.data.message);
            fetchBudgets();  // Re-fetch budgets to reflect the changes
          }
        } catch (error) {
          console.error("Error deleting budget:", error);
          alert("Error deleting the budget.");
        }
      };
  
      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options); // Change 'en-US' to the appropriate locale if needed
      };
  
      const navigateToCreateBudget = () => {
        router.push("/create-budget");
      };
  
      onMounted(fetchBudgets);
  
      return {
        budgets,
        selectedCurrency,
        currencies,
        fetchBudgets,
        formatDate,
        deleteBudget,
        navigateToCreateBudget,
      };
    },
  };
  </script>
  


  <style scoped>
  .budgets-container {
    font-family: 'Arial', sans-serif;
    padding: 20px;
    background-color: #f4f7fc;
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
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
  .budgets-list {
    list-style-type: none;
    padding: 0;
  }
  
  .budget-item {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .budget-item:hover {
    transform: translateY(-5px);
  }
  
  .budget-item h2 {
    margin-top: 0;
    color: #2d2d2d;
  }
  
  .budget-info p {
    margin: 5px 0;
    color: #555;
  }
  
  .budget-actions {
    text-align: right;
  }
  
  .delete-btn {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .delete-btn:hover {
    background-color: #e63946;
    transform: scale(1.05);
  }
  
  .create-btn {
  display: block;
  width: 100%;
  background-color: #68a3d6; /* Gris doux */
  color: white;
  padding: 12px;
  font-size: 16px;
  border-radius: 4px;
  border: none;
  margin-top: 30px;
  cursor: pointer;
  transition: all 0.3s ease; /* Transition fluide pour tous les changements */
}

.create-btn:hover {
  background-color: #4a8bb0; /* Gris un peu plus foncé pour le hover */
  transform: translateY(-3px); /* Effet de décalage léger */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombrage subtil pour un effet moderne */
}


  @media (min-width: 768px) {
    .budgets-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    .budgets-list {
      width: 80%;
    }
  }
  </style>
  