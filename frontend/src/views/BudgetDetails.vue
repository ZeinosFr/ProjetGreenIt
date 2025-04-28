<template>
    <div>
      <h1>Budget Details</h1>
      <div v-if="budget">
        <h2>{{ budget.BudgetName }}</h2>
        <p>Total Budget: {{ budget.ConvertedBudgetAmount }} {{ budget.Currency }}</p>
        <p>Total Spent: {{ budget.ConvertedTotalSpent }} {{ budget.Currency }}</p>
        <p>Remaining Budget: {{ budget.ConvertedRemainingBudget }} {{ budget.Currency }}</p>
        <p>Categories: {{ budget.CategoryNames }}</p>
      </div>
      <p v-else>Loading...</p>
    </div>
  </template>
  
  <script>
  import { baseURL } from '@/config';

  export default {
    data() {
      return {
        budget: null,
      };
    },
    mounted() {
      const budgetId = this.$route.params.id;
      this.fetchBudgetReport(budgetId);
    },
    methods: {
      async fetchBudgetReport(budgetId) {
        try {
          const currency = "INR"; // La devise que tu veux afficher
          const response = await fetch(`${baseURL}/api/budgets/reports?currency=${currency}`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
          const data = await response.json();
          
          // Trouver le budget correspondant à l'ID
          const budget = data.find((budget) => budget.BudgetID === budgetId);
          if (budget) {
            this.budget = budget;
          } else {
            console.error('Budget not found');
          }
        } catch (error) {
          console.error("Error fetching budget report:", error);
        }
      },
    },
  };
  </script>
  