'use client';

import { formatPrice } from '@/app/utils/formatPrice';
import { useCart } from '@/app/lib/CartContext';
import type { Product } from '@/app/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 dark:text-white">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{formatPrice(parseFloat(product.price))}</p>
        <button
          onClick={() => addItem(product)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
} 
