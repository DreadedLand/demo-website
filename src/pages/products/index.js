import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductCard from '@/components/ProductCard';

export default function Products() {
  const router = useRouter();
  const { category, search } = router.query;
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    if (router.isReady) {
      setSelectedCategory(category || '');
      fetchProducts();
    }
  }, [router.isReady, category, search]);

  const fetchProducts = async () => {
    setLoading(true);
    let url = '/api/products?';
    if (category) url += `category=${category}&`;
    if (search) url += `search=${search}&`;
    
    const res = await fetch(url);
    let data = await res.json();
    
    setProducts(data);
    setLoading(false);
  };

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    const query = { ...router.query };
    if (slug) {
      query.category = slug;
    } else {
      delete query.category;
    }
    router.push({ pathname: '/products', query }, undefined, { shallow: true });
  };

  const filteredProducts = products
    .filter(p => {
      if (priceRange === 'under100') return p.price < 100;
      if (priceRange === '100to500') return p.price >= 100 && p.price < 500;
      if (priceRange === '500to1000') return p.price >= 500 && p.price < 1000;
      if (priceRange === '1000to5000') return p.price >= 1000 && p.price < 5000;
      if (priceRange === 'over5000') return p.price >= 5000;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.created_at) - new Date(a.created_at);
    });

  return (
    <>
      <Head>
        <title>Products - Melodic Instruments</title>
        <meta name="description" content="Browse our collection of premium musical instruments." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="section-title">
            {search ? `Search Results for "${search}"` : 'All Products'}
          </h1>
          <p className="mt-2 text-secondary-600">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-secondary-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.slug ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-secondary-900 mb-3">Price Range</h3>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full input-field text-sm"
                >
                  <option value="all">All Prices</option>
                  <option value="under100">Under $100</option>
                  <option value="100to500">$100 - $500</option>
                  <option value="500to1000">$500 - $1,000</option>
                  <option value="1000to5000">$1,000 - $5,000</option>
                  <option value="over5000">Over $5,000</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-semibold text-secondary-900 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full input-field text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-secondary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">No products found</h3>
                <p className="text-secondary-600">Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
