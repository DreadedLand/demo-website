import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Checkout() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    address: '',
    city: '',
    zip: '',
    country: 'United States'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
          })),
          shippingAddress: form.address,
          shippingCity: form.city,
          shippingZip: form.zip,
          shippingCountry: form.country
        })
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        router.push(`/orders/${data.orderId}?success=true`);
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  if (!user) {
    router.push('/login?redirect=/checkout');
    return null;
  }

  if (cart.length === 0) {
    return (
      <>
        <Head>
          <title>Checkout - Melodic Instruments</title>
        </Head>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-display font-bold text-secondary-900 mb-4">Your cart is empty</h1>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </>
    );
  }

  const shipping = cartTotal >= 500 ? 0 : 49.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  return (
    <>
      <Head>
        <title>Checkout - Melodic Instruments</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-6">Shipping Information</h2>
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="input-field"
                    placeholder="123 Music Lane"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="input-field"
                      placeholder="Nashville"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={form.zip}
                      onChange={(e) => setForm({ ...form, zip: e.target.value })}
                      className="input-field"
                      placeholder="37203"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Country
                  </label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="input-field"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>France</option>
                  </select>
                </div>

                <hr className="my-6" />

                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Payment Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="4242 4242 4242 4242"
                    defaultValue="4242 4242 4242 4242"
                  />
                  <p className="text-xs text-secondary-500 mt-1">Demo mode - no real payment</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="123"
                      defaultValue="123"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-6 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Place Order • $${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 max-h-64 overflow-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-secondary-900">{item.name}</p>
                      <p className="text-sm text-secondary-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-secondary-900">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <div className="space-y-2 text-secondary-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-lg font-bold text-secondary-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
