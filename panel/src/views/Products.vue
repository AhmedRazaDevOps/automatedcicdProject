<template>
  <div class="products-view">
    <div class="header-actions">
      <div>
        <h1>Manage Products</h1>
        <p class="subtitle">Direct CRUD Operations against .NET REST API</p>
      </div>
      <button class="btn-primary" @click="showModal = true">+ Add Product</button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>#{{ product.id }}</td>
            <td><strong>{{ product.name }}</strong></td>
            <td>{{ product.description }}</td>
            <td>${{ product.price.toFixed(2) }}</td>
            <td>{{ product.stockQuantity }}</td>
            <td>
              <button class="btn-danger" @click="removeProduct(product.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for adding new product -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <h3>Add New Product</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label>Product Name</label>
            <input v-model="form.name" required class="form-control" placeholder="e.g. Next.js Pro Kit" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" class="form-control" placeholder="Product details..."></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Price ($)</label>
              <input v-model.number="form.price" type="number" step="0.01" required class="form-control" />
            </div>
            <div class="form-group">
              <label>Stock Quantity</label>
              <input v-model.number="form.stockQuantity" type="number" required class="form-control" />
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="showModal = false">Cancel</button>
            <button type="submit" class="btn-primary">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchProducts, createProduct, deleteProduct } from '../services/api';

const products = ref([]);
const showModal = ref(false);
const form = ref({
  name: '',
  description: '',
  price: 0,
  stockQuantity: 10,
  categoryId: 1
});

const loadProducts = async () => {
  products.value = await fetchProducts();
};

const submitForm = async () => {
  await createProduct({ ...form.value });
  showModal.value = false;
  form.value = { name: '', description: '', price: 0, stockQuantity: 10, categoryId: 1 };
  await loadProducts();
};

const removeProduct = async (id) => {
  if (confirm(`Delete product #${id}?`)) {
    await deleteProduct(id);
    await loadProducts();
  }
};

onMounted(loadProducts);
</script>

<style scoped>
.products-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.subtitle {
  color: #94a3b8;
}

.btn-primary {
  background: #38bdf8;
  color: #0f172a;
  border: none;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
}

.btn-secondary {
  background: #334155;
  color: #f8fafc;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
}

.btn-danger {
  background: #f43f5e;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: #1e293b;
  border-radius: 8px;
}

.data-table th, .data-table td {
  padding: 1rem;
  border-bottom: 1px solid #334155;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-card {
  background: #1e293b;
  border: 1px solid #334155;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 0.4rem;
}

.form-control {
  width: 100%;
  padding: 0.6rem;
  background: #0f172a;
  border: 1px solid #334155;
  color: #fff;
  border-radius: 6px;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
