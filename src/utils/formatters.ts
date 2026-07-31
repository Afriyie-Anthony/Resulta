/**
 * Format currency in Ghanaian Cedi (GH₵)
 */
export const formatCedi = (amount: number): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace('GHS', 'GH₵');
};

/**
 * Format Ghanaian phone numbers (+233 XX XXX XXXX or 0XX XXX XXXX)
 */
export const formatGhanaPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('233') && cleaned.length === 12) {
    return `+233 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Format date for transactions/orders
 */
export const formatDate = (dateString: string | Date): string => {
  const d = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * Mask sensitive voucher PINs for display
 */
export const maskVoucherPin = (pin: string): string => {
  if (!pin || pin.length < 6) return '******';
  return `${pin.slice(0, 3)}••••${pin.slice(-2)}`;
};

/**
 * Copy text to clipboard helper
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
};
