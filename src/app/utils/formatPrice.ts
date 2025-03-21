import type { Product } from '../lib/types';

export const formatPrice = (price: number): string => {
  return `€${price.toFixed(2)}`;
};

export const calculateTotal = (items: Product[]): number => {
  return items.reduce((sum, item) => {
    const price = parseFloat(item.price);
    const quantity = item.quantity || 1;
    return sum + (isNaN(price) ? 0 : price * quantity);
  }, 0);
}; 