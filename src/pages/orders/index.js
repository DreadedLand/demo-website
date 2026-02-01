import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/orders');
    } else if (user) {
      fetchOrders();
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setOrders(data);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Orders - Melodic Instruments</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <svg className="w-16 h-16 text-secondary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">No orders yet</h3>
            <p className="text-secondary-600 mb-6">Start shopping to see your orders here.</p>
            <Link href="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-secondary-900">Order #{order.id}</p>
                    <p className="text-sm text-secondary-500 mt-1">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-lg font-bold text-secondary-900">
                      ${order.total.toLocaleString()}
                    </span>
                    <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
