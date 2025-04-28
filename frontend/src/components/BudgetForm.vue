<template>
    <div>
      <h2>{{ isEdit ? 'Edit Budget' : 'Create Budget' }}</h2>
      <form @submit.prevent="handleSubmit">
        <input v-model="budget.name" placeholder="Budget Name" required />
        <input v-model="budget.amount" placeholder="Amount" type="number" required />
        <input v-model="budget.startDate" type="date" required />
        <input v-model="budget.endDate" type="date" required />
        <select v-model="budget.currency" required>
          <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
        </select>
        <button type="submit">{{ isEdit ? 'Update' : 'Create' }}</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      budgetId: { type: Number, default: null }
    },
    data() {
      return {
        isEdit: !!this.budgetId,
        budget: {
          name: '',
          amount: '',
          startDate: '',
          endDate: '',
          currency: 'EUR'
        },
        currencies: ['USD', 'EUR', 'THB', 'CAD', 'INR', 'AUD', 'CNY', 'JPY']
      };
    },
    methods: {
      handleSubmit() {
        if (this.isEdit) {
          // Mettre à jour un budget existant
          this.$emit('update-budget', this.budget);
        } else {
          // Créer un nouveau budget
          this.$emit('create-budget', this.budget);
        }
      }
    }
  };
  </script>
  