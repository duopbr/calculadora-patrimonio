
/**
 * Formats a number as Brazilian Real (BRL) currency
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Parses a string into a number, handling BRL currency format
 */
export const parseCurrency = (value: string): number => {
  // Remove currency symbols, spaces, and dots used as thousand separators
  const cleanValue = value.replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};
