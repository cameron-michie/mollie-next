'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '@/app/lib/types';

interface CartContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, change: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const addItem = (product: Product) => {
    setItems(prevItems => [...prevItems, { ...product, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, change: number) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      const newQuantity = Math.max(1, (newItems[index].quantity || 1) + change);
      newItems[index] = {
        ...newItems[index],
        quantity: newQuantity
      };
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 