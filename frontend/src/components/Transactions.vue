<template>
  <div>
    <h1>Your Transactions</h1>

    <!-- Affichage conditionnel de la section avec les flèches -->
    <div v-if="!showAll" class="header">
      <button @click="previousMonth">&lt;</button>
      <span>{{ currentMonthDisplay }}</span>
      <button @click="nextMonth">&gt;</button>
    </div>

    <!-- Bouton Show All / Show Monthly -->
    <button class="show-all-btn" @click="showAll ? showMonthlyTransactions() : showAllTransactions()">
      {{ showAll ? "Show Monthly" : "Show All" }}
    </button>

    <!-- Bouton pour aller à la page de création de transaction -->

    <!-- Liste des transactions -->
    <ul class="transactions-list">
      <li v-for="transaction in transactions" :key="transaction.TransactionID">
        <p><strong>Description:</strong> {{ transaction.Description }}</p>
        <p><strong>Date:</strong> {{ formatDate(transaction.Date) }}</p>
        <p><strong>Amount:</strong> <span
              class="amount"
              :class="getCategoryType(transaction.CategoryID) === 'Expense' ? 'Expense' : 'Income'"
            >
              {{ formatTransactionAmount(transaction) }}
            </span></p>

        <button @click="deleteTransaction(transaction.TransactionID)">Delete</button>
      </li>
    </ul>
    <button class="create-transaction-btn" @click="goToCreateTransaction">Create Transaction</button>

  </div>
</template>




<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { baseURL } from '@/config';
export default {
  name: "Transactions",
  setup() {
    const transactions = ref([]);
    const router = useRouter();
    const categories = ref([]); // Ajoute une ref pour stocker les catégories


    // Gestion du mois actuel
    const currentMonth = ref(new Date().getMonth()); // Index du mois (0 = janvier, 11 = décembre)
    const currentYear = ref(new Date().getFullYear());
    const currentMonthDisplay = ref("");
    const showAll = ref(false);  // Nouvel état pour savoir si on affiche toutes les transactions ou pas

    const updateMonthDisplay = () => {
      // Affichage sous forme de nombre (ex : "11/2024")
      currentMonthDisplay.value = `${currentMonth.value + 1}/${currentYear.value}`;
    };

    // Récupère les dates de début et de fin du mois courant
    const getStartAndEndDates = () => {
      const startDate = new Date(currentYear.value, currentMonth.value, 2);
      const endDate = new Date(currentYear.value, currentMonth.value + 1, 0); // Dernier jour du mois
      return {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      };
    };

    // Récupérer les transactions filtrées par mois
    const fetchTransactions = async () => {
        const { startDate, endDate } = getStartAndEndDates();
        try {
          const response = await axios.get(`${baseURL}/api/transactions`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            params: { startDate, endDate },
          });
          console.log(response.data); // Vérifie les données reçues
          transactions.value = response.data;
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      };


// Récupère les catégories depuis l'API ou les données statiques
      const fetchCategories = async () => {
        try {
          const response = await axios.get(`${baseURL}/api/categories`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          categories.value = response.data;
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

// Méthode pour obtenir le type de la catégorie de la transaction
    const getCategoryType = (transactionCategoryId) => {
      const category = categories.value.find((cat) => cat.CategoryID === transactionCategoryId);
      return category ? category.Type : null;
    };


    // Ajoutez cette méthode dans la section 'setup' pour formater le montant
    const formatTransactionAmount = (transaction) => {
      const categoryType = getCategoryType(transaction.CategoryID); // Récupère le type de la catégorie
      const symbol = categoryType === "Expense" ? "- " : "+ "; // Détermine le signe du montant
      return `${symbol}${Math.abs(transaction.Amount)} ${transaction.Currency}`;
    };

    // Méthodes pour naviguer entre les mois
    const previousMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value -= 1;
      } else {
        currentMonth.value -= 1;
      }
      updateMonthDisplay();
      fetchTransactions();
    };

    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value += 1;
      } else {
        currentMonth.value += 1;
      }
      updateMonthDisplay();
      fetchTransactions();
    };

    // Méthode pour afficher toutes les transactions
    const showAllTransactions = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/transactions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        transactions.value = response.data;
        showAll.value = true; // On passe à "Show Monthly" après avoir cliqué sur "Show All"
      } catch (error) {
        console.error("Error fetching all transactions:", error);
      }
    };

    // Méthode pour revenir à l'affichage mensuel
    const showMonthlyTransactions = () => {
      showAll.value = false;  // Réinitialiser l'état du bouton
      fetchTransactions();  // Rafraîchir les transactions pour le mois courant
    };

    const deleteTransaction = async (transactionId) => {
      try {
        const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
        if (confirmDelete) {
          await axios.delete(`${baseURL}/api/transactions/${transactionId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          alert("Transaction deleted successfully");
          fetchTransactions();
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("Error deleting transaction");
      }
    };

    const goToCreateTransaction = () => {
      router.push("/create-transaction");
    };

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "short", day: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", options);
    };

    // Initialisation
    onMounted(() => {
      updateMonthDisplay();
      fetchTransactions();
      fetchCategories();

    });

    return {
      transactions,
      deleteTransaction,
      formatDate,
      goToCreateTransaction,
      previousMonth,
      nextMonth,
      showAllTransactions,
      showMonthlyTransactions,
      currentMonth,
      currentYear,
      currentMonthDisplay,
      showAll,
      formatTransactionAmount,
      getCategoryType,
    };
  },
};
</script>


<style scoped>
/* Style global pour un alignement central et une meilleure lisibilité */
body {
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5; /* Arrière-plan léger pour contraster avec les éléments */
  margin: 0;
  padding: 0;
  color: #333;
}

/* Titre principal */
h1 {
  text-align: center;
  margin: 20px 0;
  font-size: 2rem;
  color: #444;
}

/* Conteneur principal */
div {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Ombre subtile */
}

/* Style pour la navigation des mois */
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.header button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.header button:hover {
  background-color: #0056b3;
  transform: scale(1.1);
}

.header span {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
}

/* Style du bouton principal */
.show-all-btn,
.create-transaction-btn {
  display: inline-block;
  width: 100%;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #68a3d6;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  margin-top: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.show-all-btn:hover,
.create-transaction-btn:hover {
  background-color: #4a8bb0;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Liste des transactions */
.transactions-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.transactions-list li {
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.transactions-list li:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.transactions-list li p {
  margin: 5px 0;
  font-size: 0.95rem;
  color: #555;
}

.transactions-list li button {
  align-self: flex-start;
  padding: 8px 15px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
  background-color: #dc3545;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.transactions-list li button:hover {
  background-color: #a71d2a;
  transform: scale(1.05);
}

.Income {
  color: green; /* Montant pour Income en vert */
}

.Expense {
  color: red; /* Montant pour Expense en rouge */
}

/* Responsivité */
@media (max-width: 600px) {
  .header {
    flex-direction: column;
    gap: 10px;
  }

  .header span {
    font-size: 1rem;
  }

  .transactions-list li {
    flex-direction: column;
  }
}

</style>
