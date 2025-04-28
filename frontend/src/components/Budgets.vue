<template>
  <div class="budgets">
    <h2>Monthly Budgets</h2>
    <ul>
      <li>Groceries: $500</li>
      <li>Entertainment: $200</li>
      <li>Rent: $1,000</li>
    </ul>
    </div>
  <div>
    <button @click="openBudgetForm" class="add-budget-btn">Create Budget</button>

    <!-- Include the Budget Form component -->
    <BudgetForm ref="budgetForm" />
  </div>
</template>

<script>
import BudgetForm from "./BudgetForm.vue"; // Import the BudgetForm component

export default {
  components: {
    BudgetForm,
  },
  methods: {
    openBudgetForm() {
      // Open the budget form when the button is clicked
      this.$refs.budgetForm.openForm();
    },
  },
};
</script>

<style scoped>
.budgets {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  margin-top: 20px;
}

.add-budget-btn {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

.add-budget-btn:hover {
  background-color: #45a049;
}
</style>
