<template>
  <nav class="navbar">
    <div class="logo">Finance tracker</div>
    <ul class="nav-links">
      <li><router-link to="/" class="nav-item">Dashboard</router-link></li>
      <li><router-link to="/transactions" class="nav-item">Transactions</router-link></li>
      <li><router-link to="/budgets" class="nav-item">Budgets</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 15px;
}

.nav-links li a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
}

.nav-links li a:hover {
  text-decoration: underline;
}
</style>
