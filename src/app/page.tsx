// import { permanentRedirect } from 'next/navigation'

// export default function Home() {
//   return (
//     permanentRedirect("/checkout")
//   );
// }
'use client';

import { useState } from 'react';
import type { Product } from './lib/types';
import ProductCard from './components/shop/product';
import CartComponent from './components/shop/cart';
import products from '@/data/products.json';

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">The shop</h1>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2"
        >
          Cart
        </button>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(products as Product[]).map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      {isCartOpen && (
        <CartComponent onClose={() => setIsCartOpen(false)} />
      )}
    </div>
  );
}

