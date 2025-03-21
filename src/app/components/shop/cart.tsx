'use client';

import { useRouter } from 'next/navigation';
import { formatPrice, calculateTotal } from '@/app/utils/formatPrice';
import { useCart } from '@/app/lib/CartContext';

interface CartProps {
  onClose: () => void;
}

export default function CartComponent({ onClose }: CartProps) {
  const { items, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const total = calculateTotal(items);

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold dark:text-white">Cart</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="border dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-700"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="dark:text-white">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {formatPrice(parseFloat(item.price))}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(index, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                    >
                      -
                    </button>
                    <span className="dark:text-white">{item.quantity || 1}</span>
                    <button 
                      onClick={() => updateQuantity(index, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {formatPrice(parseFloat(item.price) * (item.quantity || 1))}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t dark:border-gray-700 pt-4">
            <div className="flex justify-between mb-4">
              <span className="dark:text-white">Total:</span>
              <span className="font-bold dark:text-white">{formatPrice(total)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors duration-200"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
} 
