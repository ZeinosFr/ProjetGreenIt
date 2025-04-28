<template>
    <div class="page-404">
      <h1>404</h1>
      <h2>Oops! Page not found.</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <router-link to="/" class="home-button">Back to Home</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PageNotFound'
  };
  </script>
  
  <style scoped>
  .page-404 {
    text-align: center;
    padding: 100px 20px;
    background-color: #f4f7fc;
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .page-404 h1 {
    font-size: 120px;
    margin: 0;
    color: #3498db;
  }
  
  .page-404 h2 {
    font-size: 32px;
    margin-top: 10px;
    color: #2c3e50;
  }
  
  .page-404 p {
    margin-top: 20px;
    font-size: 18px;
    color: #7f8c8d;
  }
  
  .home-button {
    margin-top: 30px;
    padding: 12px 24px;
    background-color: #3498db;
    color: white;
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
    border-radius: 8px;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .home-button:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }
  </style>
  