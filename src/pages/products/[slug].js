import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        
        // Fetch related products
        const relatedRes = await fetch(`/api/products?category=${data.category_slug}&limit=4`);
        const related = await relatedRes.json();
        setRelatedProducts(related.filter(p => p.id !== data.id).slice(0, 3));
      } else {
        router.push('/products');
      }
    } catch (error) {
      router.push('/products');
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-96 bg-gray-200 rounded-xl" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <>
      <Head>
        <title>{product.name} - Melodic Instruments</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-500 mb-8">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category_slug}`} className="hover:text-primary-600">
            {product.category_name}
          </Link>
          <span>/</span>
          <span className="text-secondary-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.featured === 1 && (
              <span className="absolute top-4 left-4 bg-primary-600 text-white text-sm font-semibold px-3 py-1 rounded">
                Featured
              </span>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="text-primary-600 font-medium uppercase tracking-wide text-sm">
              {product.category_name}
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mt-2">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mt-4">
              <span className="text-3xl font-bold text-secondary-900">
                ${product.price.toLocaleString()}
              </span>
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  {product.stock} in stock
                </span>
              ) : (
                <span className="text-red-600 font-medium">Out of stock</span>
              )}
            </div>

            <p className="text-secondary-600 mt-6 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-secondary-700 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-secondary-600 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 text-secondary-600 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={handleAddToCart} className="btn-primary flex-1">
                    Add to Cart
                  </button>
                  <Link href="/cart" className="btn-secondary">
                    View Cart
                  </Link>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-secondary-900 mb-4">Why Choose This Instrument</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-secondary-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free shipping on orders over $500
                </li>
                <li className="flex items-center gap-3 text-secondary-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  30-day hassle-free returns
                </li>
                <li className="flex items-center gap-3 text-secondary-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  1-year warranty included
                </li>
                <li className="flex items-center gap-3 text-secondary-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Expert customer support
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <Link key={p.id} href={`/products/${p.slug}`} className="card group overflow-hidden">
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600">
                      {p.name}
                    </h3>
                    <span className="text-lg font-bold text-secondary-900 mt-1 block">
                      ${p.price.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
