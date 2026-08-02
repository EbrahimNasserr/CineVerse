/**
 * Formats a number as a USD currency string.
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
