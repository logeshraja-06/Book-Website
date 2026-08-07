/**
 * Standard Indian Rupee price formatter
 * e.g. 799 -> "₹799", 1299 -> "₹1,299"
 */
export function formatPrice(price) {
  if (price === undefined || price === null || isNaN(Number(price))) {
    return '₹0';
  }
  return `₹${Number(price).toLocaleString('en-IN')}`;
}
