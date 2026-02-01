import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Categories - Melodic Instruments</title>
        <meta name="description" content="Browse our instrument categories" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="section-title">Shop by Category</h1>
          <p className="mt-4 text-secondary-600 max-w-2xl mx-auto">
            Explore our wide range of instruments, from classic guitars to professional pianos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(category => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative h-72 rounded-xl overflow-hidden card"
            >
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  {category.name}
                </h2>
                <p className="text-white/80 text-sm mb-4">
                  {category.description}
                </p>
                <span className="inline-flex items-center text-primary-400 font-medium group-hover:text-primary-300 transition-colors">
                  Browse Collection
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
