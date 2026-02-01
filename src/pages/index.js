import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?featured=true&limit=8').then(res => res.json()),
      fetch('/api/categories').then(res => res.json())
    ]).then(([products, cats]) => {
      setFeaturedProducts(products);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Melodic - Premium Musical Instruments</title>
        <meta name="description" content="Your premier destination for quality musical instruments. From beginners to professionals." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-secondary-900 to-secondary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Find Your
              <span className="text-primary-500"> Perfect Sound</span>
            </h1>
            <p className="mt-6 text-lg text-secondary-300 leading-relaxed">
              Discover our curated collection of premium musical instruments. 
              From classic guitars to concert pianos, we have everything you need 
              to make beautiful music.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary">
                Shop Now
              </Link>
              <Link href="/categories" className="btn-outline border-white text-white hover:bg-white hover:text-secondary-900">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative bg-white/10 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-400">500+</div>
                <div className="text-secondary-300 text-sm mt-1">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-400">50+</div>
                <div className="text-secondary-300 text-sm mt-1">Brands</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-400">10k+</div>
                <div className="text-secondary-300 text-sm mt-1">Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-400">4.9</div>
                <div className="text-secondary-300 text-sm mt-1">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">Shop by Category</h2>
          <p className="mt-4 text-secondary-600 max-w-2xl mx-auto">
            Explore our wide range of instruments organized by category
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative h-48 rounded-xl overflow-hidden"
            >
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-end p-4">
                <h3 className="text-white font-semibold text-lg">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="section-title">Featured Instruments</h2>
              <p className="mt-4 text-secondary-600">
                Hand-picked selections from our premium collection
              </p>
            </div>
            <Link href="/products" className="btn-outline hidden md:inline-flex">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-8 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/products" className="btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">Free Shipping</h3>
            <p className="text-secondary-600">Free shipping on all orders over $500. Safe and secure delivery guaranteed.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">Secure Payment</h3>
            <p className="text-secondary-600">Multiple secure payment options. Your transactions are always protected.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">Easy Returns</h3>
            <p className="text-secondary-600">30-day return policy. Not satisfied? Return it hassle-free.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Start Your Musical Journey?
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto mb-8">
              Join thousands of musicians who trust Melodic for their instrument needs. 
              Sign up today and get 10% off your first order.
            </p>
            <Link href="/register" className="inline-block bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
