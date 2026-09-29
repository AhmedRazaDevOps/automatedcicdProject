<template>
  <nav class="navbar">
    <div class="brand">
      <span class="logo-icon">🎛️</span>
      <span class="brand-name">Vue 3 Admin Panel</span>
    </div>

    <div class="nav-links">
      <router-link to="/" class="nav-item">Dashboard</router-link>
      <router-link to="/products" class="nav-item">Products</router-link>
      <router-link to="/categories" class="nav-item">Categories</router-link>
      <router-link to="/users" class="nav-item">Users</router-link>
      <router-link to="/orders" class="nav-item">Orders</router-link>
      <a href="http://localhost:3001" target="_blank" class="nav-item external">User Store ↗</a>
      
      <span v-if="adminUser" class="admin-profile">
        👤 {{ adminUser.username }}
        <button @click="logout" class="btn-logout">Logout</button>
      </span>
      <router-link v-else to="/login" class="nav-item login-link">Sign In</router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const adminUser = ref(null);

onMounted(() => {
  const saved = localStorage.getItem('admin_user');
  if (saved) {
    try {
      adminUser.value = JSON.parse(saved);
    } catch (e) {
      adminUser.value = null;
    }
  }
});

const logout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  adminUser.value = null;
  window.location.href = '/login';
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1e293b;
  padding: 1rem 2rem;
  border-bottom: 1px solid #334155;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #38bdf8;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.nav-item {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-item:hover, .router-link-active {
  color: #38bdf8;
}

.external { color: #818cf8; }
.admin-profile { color: #38bdf8; font-weight: bold; display: flex; align-items: center; gap: 0.5rem; }
.btn-logout { background: #f43f5e; color: #fff; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
.login-link { background: #38bdf8; color: #0f172a !important; padding: 0.3rem 0.8rem; border-radius: 6px; font-weight: bold; }
</style>
