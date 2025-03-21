export function formatPrice(price) {
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice)) return '$0.00';
  return `$${numericPrice.toFixed(2)}`;
}

export function calculateTotal(items) {
  return items.reduce((sum, item) => {
    const price = parseFloat(item.price);
    const quantity = item.quantity || 1;
    return sum + (isNaN(price) ? 0 : price * quantity);
  }, 0);
} 
