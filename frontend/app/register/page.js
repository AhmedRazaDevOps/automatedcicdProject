'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../lib/api';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await registerUser({ username, email, passwordHash: password });
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res));
      setMessage(`Account created successfully! Welcome, ${res.username}!`);
      setTimeout(() => router.push('/products'), 1000);
    } else {
      setMessage('Registration failed.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto', background: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #334155' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#38bdf8' }}>Create Account</h2>
      
      {message && <div style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }}
            placeholder="e.g. johndoe"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }}
            placeholder="john@example.com"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn" style={{ width: '100%', textAlign: 'center' }} disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
        Already have an account? <a href="/login">Sign In</a>
      </p>
    </div>
  );
}
