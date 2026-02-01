import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Head>
          <title>Cart - Melodic Instruments</title>
        </Head>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <svg className="w-24 h-24 text-secondary-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h1 className="text-3xl font-display font-bold text-secondary-900 mb-4">Your Cart is Empty</h1>
          <p className="text-secondary-600 mb-8">Looks like you haven't added any instruments yet.</p>
          <Link href="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Cart ({cart.length}) - Melodic Instruments</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {cart.map((item, index) => (
                <div key={item.id} className={`p-6 ${index > 0 ? 'border-t border-gray-100' : ''}`}>
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <Link href={`/products/${item.slug}`} className="font-semibold text-secondary-900 hover:text-primary-600">
                        {item.name}
                      </Link>
                      <p className="text-primary-600 text-sm mt-1">{item.category_name}</p>
                      <p className="text-lg font-bold text-secondary-900 mt-2">
                        ${item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-secondary-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-secondary-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-secondary-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-secondary-600">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{cartTotal >= 500 ? 'FREE' : '$49.99'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (estimated)</span>
                  <span>${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-lg font-bold text-secondary-900 mb-6">
                <span>Total</span>
                <span>
                  ${(cartTotal + (cartTotal >= 500 ? 0 : 49.99) + cartTotal * 0.08).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <button onClick={handleCheckout} className="btn-primary w-full">
                Proceed to Checkout
              </button>

              {!user && (
                <p className="text-sm text-secondary-500 mt-4 text-center">
                  <Link href="/login" className="text-primary-600 hover:underline">Sign in</Link> for faster checkout
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-secondary-600 text-sm">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
