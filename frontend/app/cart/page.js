'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '../../lib/api';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Cloud Server Plan A', price: 49.99, quantity: 1 },
    { id: 3, name: 'High-Speed Mesh Router X', price: 129.50, quantity: 1 }
  ]);
  const [address, setAddress] = useState('123 Tech Boulevard, Silicon Valley, CA');
  const [ordering, setOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setOrdering(true);

    const payload = {
      userId: 2,
      shippingAddress: address,
      items: cartItems.map(i => ({ productId: i.id, quantity: i.quantity, unitPrice: i.price }))
    };

    const result = await createOrder(payload);
    setOrderComplete(result);
    setOrdering(false);
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(i => i.id !== id));
  };

  if (orderComplete) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', background: '#1e293b', padding: '2.5rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #334155' }}>
        <h2 style={{ color: '#4ade80', marginBottom: '1rem' }}>🎉 Order Placed Successfully!</h2>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Order #{orderComplete.id} has been registered with the .NET REST API & MySQL database.</p>
        <button onClick={() => router.push('/products')} className="btn">Return to Catalog</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Shopping Cart & Checkout</h1>

      {cartItems.length === 0 ? (
        <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8' }}>Your shopping cart is empty.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>Items ({cartItems.length})</h3>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #334155' }}>
                <div>
                  <h4>{item.name}</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>${item.price.toFixed(2)} × {item.quantity}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeItem(item.id)} style={{ background: '#f43f5e', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span style={{ color: '#38bdf8' }}>${total.toFixed(2)}</span>
            </div>

            <form onSubmit={handleCheckout}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Shipping Address</label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}
                rows={3}
              />

              <button type="submit" className="btn" style={{ width: '100%', textAlign: 'center' }} disabled={ordering}>
                {ordering ? 'Processing...' : 'Place Order Now'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
