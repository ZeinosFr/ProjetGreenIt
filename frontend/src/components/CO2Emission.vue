<template>
    <div class="co2-emission">
      <h3>CO₂ Emission Tracker</h3>
      <ul>
        <li v-for="(request, index) in requests" :key="index">
          {{ request.name }} → {{ request.co2.toFixed(6) }} g CO₂
        </li>
      </ul>
      <p v-if="requests.length">Total CO₂ emitted: <strong>{{ totalCO2.toFixed(6) }}</strong> g</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CO2Emission',
    data() {
      return {
        requests: []
      };
    },
    computed: {
      totalCO2() {
        return this.requests.reduce((sum, r) => sum + r.co2, 0);
      }
    },
    methods: {
      logEmission(name, sizeBytes) {
        const sizeKB = sizeBytes / 1024;
        const estimatedCO2 = sizeKB * 0.00176; // 1 KB ~ 0.00176g CO₂
        this.requests.push({ name, co2: estimatedCO2 });
      }
    }
  };
  </script>
  
  <style scoped>
  .co2-emission {
    background-color: #eaf6f6;
    padding: 1em;
    margin: 1em 0;
    border-radius: 8px;
    font-family: 'Arial', sans-serif;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  h3 {
    margin-bottom: 0.5em;
    color: #2d3436;
  }
  
  ul {
    padding-left: 1.2em;
  }
  
  li {
    margin-bottom: 0.4em;
    font-size: 1rem;
    color: #34495e;
  }
  
  p {
    margin-top: 1em;
    font-weight: bold;
    color: #27ae60;
  }
  </style>
  