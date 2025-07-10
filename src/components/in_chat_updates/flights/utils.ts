/**
 * Format a duration in minutes to a human-readable string
 * @param minutes Duration in minutes
 * @returns Formatted duration string (e.g., "2h 15m")
 */
export const formatDuration = (minutes: number): string => {
  if (!minutes && minutes !== 0) return 'Unknown';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
};

/**
 * Format a date string in a user-friendly way
 * @param dateString Date string in ISO format
 * @returns Formatted date string (e.g., "Mon, Oct 12")
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Format as "Mon, Oct 12"
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a price with currency
 * @param price Price value
 * @param currency Currency code (default: USD)
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Get a friendly name for travel class
 * @param travelClass Travel class code (1-4)
 * @returns User-friendly travel class name
 */
export const getTravelClassName = (travelClass: number): string => {
  switch (travelClass) {
    case 1:
      return 'Economy';
    case 2:
      return 'Premium Economy';
    case 3:
      return 'Business';
    case 4:
      return 'First Class';
    default:
      return 'Economy';
  }
};

/**
 * Get a friendly name for flight type
 * @param type Flight type string from API
 * @returns User-friendly flight type name
 */
export const formatFlightType = (type: string): string => {
  switch (type) {
    case 'round_trip':
      return 'Round Trip';
    case 'one_way':
      return 'One Way';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
  }
}; 