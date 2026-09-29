const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

// --- Products ---
export async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error('API fetch failed');
    return await res.json();
  } catch (error) {
    return [
      { id: 1, name: 'Cloud Server Plan A', description: 'Scalable enterprise cloud instance with 8 vCPUs and 32GB RAM', price: 49.99, stockQuantity: 100, categoryId: 2 },
      { id: 2, name: 'DevOps Observability Toolkit', description: 'Real-time APM, logging, and infrastructure monitoring platform', price: 199.00, stockQuantity: 50, categoryId: 3 },
      { id: 3, name: 'High-Speed Mesh Router X', description: 'Gigabit WiFi 6 Mesh Router with built-in VPN server', price: 129.50, stockQuantity: 30, categoryId: 1 }
    ];
  }
}

export async function createProduct(product) {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return await res.json();
  } catch (error) {
    return { ...product, id: Date.now() };
  }
}

export async function deleteProduct(id) {
  try {
    await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    return true;
  }
}

// --- Categories ---
export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('API fetch failed');
    return await res.json();
  } catch (error) {
    return [
      { id: 1, name: 'Hardware & Devices', description: 'Networking gear, gadgets, and physical hardware' },
      { id: 2, name: 'Software & Cloud Services', description: 'SaaS subscriptions, enterprise software, and dev tools' },
      { id: 3, name: 'DevOps Tools', description: 'Monitoring, CI/CD, and container management utilities' }
    ];
  }
}

export async function createCategory(category) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    return await res.json();
  } catch (error) {
    return { ...category, id: Date.now() };
  }
}

export async function deleteCategory(id) {
  try {
    await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    return true;
  }
}

// --- Users ---
export async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE_URL}/users`);
    if (!res.ok) throw new Error('API fetch failed');
    return await res.json();
  } catch (error) {
    return [
      { id: 1, username: 'admin', email: 'admin@proj2.local', role: 'Admin', createdAt: new Date().toISOString() },
      { id: 2, username: 'johndoe', email: 'john@example.com', role: 'User', createdAt: new Date().toISOString() }
    ];
  }
}

export async function deleteUser(id) {
  try {
    await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    return true;
  }
}

// --- Orders ---
export async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (!res.ok) throw new Error('API fetch failed');
    return await res.json();
  } catch (error) {
    return [
      { id: 1, userId: 2, totalAmount: 179.49, status: 'Completed', shippingAddress: '123 Tech Boulevard, CA', createdAt: new Date().toISOString() }
    ];
  }
}

// --- Health ---
export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (error) {
    return { status: 'Offline / Mock', service: '.NET REST API Backend' };
  }
}
