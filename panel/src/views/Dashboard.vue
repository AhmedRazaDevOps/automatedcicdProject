<template>
  <div class="dashboard">
    <header class="page-header">
      <h1>Admin Control Dashboard</h1>
      <p class="subtitle">Monorepo System Metrics & Backend Integration</p>
    </header>

    <div class="metrics-grid">
      <div class="metric-card">
        <span class="metric-title">Total Products</span>
        <span class="metric-value">{{ products.length }}</span>
        <span class="metric-sub">Synchronized with MySQL</span>
      </div>

      <div class="metric-card">
        <span class="metric-title">Backend Status</span>
        <span class="metric-value health">{{ health.status || 'Active' }}</span>
        <span class="metric-sub">{{ health.service || '.NET REST API' }}</span>
      </div>

      <div class="metric-card">
        <span class="metric-title">System Role</span>
        <span class="metric-value">SuperAdmin</span>
        <span class="metric-sub">Full CRUD Permissions</span>
      </div>
    </div>

    <section class="recent-section">
      <h2>Recent Inventory Overview</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td>#{{ p.id }}</td>
            <td><strong>{{ p.name }}</strong></td>
            <td>${{ p.price.toFixed(2) }}</td>
            <td><span class="stock-tag">{{ p.stockQuantity }} units</span></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchProducts, fetchHealth } from '../services/api';

const products = ref([]);
const health = ref({});

onMounted(async () => {
  products.value = await fetchProducts();
  health.value = await fetchHealth();
});
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.subtitle {
  color: #94a3b8;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.metric-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.metric-title {
  color: #94a3b8;
  font-size: 0.9rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #38bdf8;
  margin: 0.5rem 0;
}

.metric-value.health {
  color: #4ade80;
}

.metric-sub {
  color: #64748b;
  font-size: 0.85rem;
}

.recent-section h2 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: #1e293b;
  border-radius: 8px;
  overflow: hidden;
}

.data-table th, .data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #334155;
}

.data-table th {
  background: #0f172a;
  color: #94a3b8;
}

.stock-tag {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.85rem;
}
</style>
