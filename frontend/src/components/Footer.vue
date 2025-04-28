<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; {{ currentYear }} Personal Finance Tracker. All rights reserved.</p>
      <p>Designed by Ludovic, Roux, Devulder, Beaubois & Gascon</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      currentYear: new Date().getFullYear(), // Affiche l'année actuelle
    };
  },
};
</script>

<style scoped>
.footer {
  background-color: #2a3d5a; /* Même couleur que le header */
  color: white;
  padding: 20px;
  text-align: center;
  font-size: 1rem;
}

.footer-content p {
  margin: 5px;
  font-size: 14px;
}

.footer-content p:first-child {
  font-weight: bold;
}
</style>
