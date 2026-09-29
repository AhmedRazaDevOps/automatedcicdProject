<template>
  <div class="users-view">
    <div class="header-actions">
      <div>
        <h1>User Management</h1>
        <p class="subtitle">View registered users and roles</p>
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>#{{ user.id }}</td>
          <td><strong>{{ user.username }}</strong></td>
          <td>{{ user.email }}</td>
          <td><span :class="['role-badge', user.role.toLowerCase()]">{{ user.role }}</span></td>
          <td>{{ new Date(user.createdAt).toLocaleDateString() }}</td>
          <td>
            <button v-if="user.role !== 'Admin'" class="btn-danger" @click="removeUser(user.id)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchUsers, deleteUser } from '../services/api';

const users = ref([]);

const loadUsers = async () => {
  users.value = await fetchUsers();
};

const removeUser = async (id) => {
  if (confirm(`Remove user #${id}?`)) {
    await deleteUser(id);
    await loadUsers();
  }
};

onMounted(loadUsers);
</script>

<style scoped>
.users-view { padding: 2rem; max-width: 1200px; margin: 0 auto; }
.header-actions { margin-bottom: 2rem; }
.subtitle { color: #94a3b8; }
.data-table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 8px; }
.data-table th, .data-table td { padding: 1rem; border-bottom: 1px solid #334155; }
.role-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
.role-badge.admin { background: rgba(129, 140, 248, 0.2); color: #818cf8; }
.role-badge.user { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
.btn-danger { background: #f43f5e; color: #fff; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; }
</style>
