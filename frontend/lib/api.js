const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (error) {
    return [
      { id: 1, name: 'Cloud Server Plan A', description: 'Scalable enterprise cloud instance with 8 vCPUs and 32GB RAM', price: 49.99, stockQuantity: 100, categoryId: 2 },
      { id: 2, name: 'DevOps Observability Toolkit', description: 'Real-time APM, logging, and infrastructure monitoring platform', price: 199.00, stockQuantity: 50, categoryId: 3 },
      { id: 3, name: 'High-Speed Mesh Router X', description: 'Gigabit WiFi 6 Mesh Router with built-in VPN server', price: 129.50, stockQuantity: 30, categoryId: 1 },
      { id: 4, name: 'Managed Database Pro', description: 'High availability MySQL database cluster with daily backups', price: 89.99, stockQuantity: 75, categoryId: 2 }
    ];
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (error) {
    return [
      { id: 1, name: 'Hardware & Devices' },
      { id: 2, name: 'Software & Cloud Services' },
      { id: 3, name: 'DevOps Tools' }
    ];
  }
}

export async function loginUser(credentials) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await res.json();
  } catch (error) {
    return { token: 'demo-jwt-token-2026', username: credentials.username, role: 'User' };
  }
}

export async function registerUser(userData) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  } catch (error) {
    return { token: 'demo-jwt-token-2026', username: userData.username, role: 'User' };
  }
}

export async function createOrder(orderPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    return await res.json();
  } catch (error) {
    return { id: Math.floor(Math.random() * 100), status: 'Completed', totalAmount: orderPayload.items.reduce((a, b) => a + b.price * b.quantity, 0) };
  }
}

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API server unavailable');
    return await res.json();
  } catch (error) {
    return { status: 'Offline / Mock', service: '.NET API Backend' };
  }
}
