<template>
  <div class="dashboard">
    <h1>Bienvenue sur votre tableau de bord</h1>
    <button @click="logout">Se déconnecter</button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('authToken');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.dashboard {
  text-align: center;
}
button {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #d32f2f;
}
</style>
