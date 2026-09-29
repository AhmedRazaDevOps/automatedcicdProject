'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <header>
      <div className="container nav">
        <a href="/" className="logo">
          ⚡ Monorepo App
        </a>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/cart">Cart 🛒</a></li>
          {user ? (
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>👤 {user.username}</span>
              <button onClick={handleLogout} style={{ background: '#f43f5e', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Logout</button>
            </li>
          ) : (
            <li><a href="/login">Sign In</a></li>
          )}
          <li><a href="http://localhost:5173" target="_blank" rel="noreferrer" style={{ color: '#818cf8' }}>Admin Panel ↗</a></li>
        </ul>
      </div>
    </header>
  );
}
