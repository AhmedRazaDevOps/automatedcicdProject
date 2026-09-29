<template>
  <div class="orders-view">
    <div class="header-actions">
      <div>
        <h1>Orders & Sales</h1>
        <p class="subtitle">Monitor transactions from Next.js user store</p>
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User ID</th>
          <th>Total Amount</th>
          <th>Status</th>
          <th>Shipping Address</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>#{{ order.id }}</td>
          <td>User #{{ order.userId }}</td>
          <td><strong style="color: #38bdf8">${{ order.totalAmount.toFixed(2) }}</strong></td>
          <td><span class="status-tag">{{ order.status }}</span></td>
          <td>{{ order.shippingAddress }}</td>
          <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchOrders } from '../services/api';

const orders = ref([]);

onMounted(async () => {
  orders.value = await fetchOrders();
});
</script>

<style scoped>
.orders-view { padding: 2rem; max-width: 1200px; margin: 0 auto; }
.header-actions { margin-bottom: 2rem; }
.subtitle { color: #94a3b8; }
.data-table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 8px; }
.data-table th, .data-table td { padding: 1rem; border-bottom: 1px solid #334155; }
.status-tag { background: rgba(74, 222, 128, 0.15); color: #4ade80; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; }
</style>
