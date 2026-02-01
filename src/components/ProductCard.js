import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link href={`/products/${product.slug}`} className="card group overflow-hidden">
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.featured === 1 && (
          <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">
            Featured
          </span>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </div>
      <div className="p-5">
        <span className="text-xs text-primary-600 font-medium uppercase tracking-wide">
          {product.category_name}
        </span>
        <h3 className="text-lg font-semibold text-secondary-900 mt-1 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-secondary-500 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-secondary-900">
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2 rounded-lg transition-colors ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary-100 text-primary-600 hover:bg-primary-600 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
