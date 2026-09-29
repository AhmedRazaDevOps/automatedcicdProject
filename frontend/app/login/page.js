'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.status === 401) {
        setError('Invalid username or password. Please try again.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError('Login failed. Please try again later.');
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setSuccess(`Welcome back, ${data.username}! Redirecting...`);
        setTimeout(() => router.push('/products'), 1000);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('Cannot reach server. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto', background: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #334155' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#38bdf8' }}>Sign In to Monorepo</h2>

      {error && (
        <div style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center' }}>
          ✓ {success}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: `1px solid ${error ? '#f43f5e' : '#334155'}`, color: '#fff', borderRadius: '6px', boxSizing: 'border-box' }}
            placeholder="e.g. ahmedraza"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: `1px solid ${error ? '#f43f5e' : '#334155'}`, color: '#fff', borderRadius: '6px', boxSizing: 'border-box' }}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn" style={{ width: '100%', textAlign: 'center' }} disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}
