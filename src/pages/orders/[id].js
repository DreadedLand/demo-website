import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OrderDetail() {
  const router = useRouter();
  const { id, success } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    const res = await fetch(`/api/orders/${id}`);
    if (res.ok) {
      const data = await res.json();
      setOrder(data);
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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-secondary-900 mb-4">Order not found</h1>
        <Link href="/orders" className="btn-primary">
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Order #{order.id} - Melodic Instruments</title>
      </Head>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-green-800">Order placed successfully!</p>
                <p className="text-sm text-green-600">Thank you for your purchase. You will receive a confirmation email shortly.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/orders" className="text-primary-600 hover:underline text-sm mb-2 block">
              ← Back to Orders
            </Link>
            <h1 className="text-2xl font-display font-bold text-secondary-900">Order #{order.id}</h1>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Order Items */}
          <div className="p-6">
            <h2 className="font-semibold text-secondary-900 mb-4">Items</h2>
            <div className="space-y-4">
              {order.items?.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <Link href={`/products/${item.slug}`} className="font-medium text-secondary-900 hover:text-primary-600">
                      {item.name}
                    </Link>
                    <p className="text-sm text-secondary-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-secondary-900">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <hr />

          {/* Shipping Info */}
          <div className="p-6">
            <h2 className="font-semibold text-secondary-900 mb-4">Shipping Address</h2>
            <p className="text-secondary-600">
              {order.shipping_address}<br />
              {order.shipping_city}, {order.shipping_zip}<br />
              {order.shipping_country}
            </p>
          </div>

          <hr />

          {/* Order Summary */}
          <div className="p-6 bg-gray-50">
            <div className="flex justify-between text-lg font-bold text-secondary-900">
              <span>Total</span>
              <span>${order.total.toLocaleString()}</span>
            </div>
            <p className="text-sm text-secondary-500 mt-2">
              Ordered on {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
