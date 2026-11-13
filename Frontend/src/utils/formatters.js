export function formatDate(dateString, options = {}) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: options.includeTime ? '2-digit' : undefined,
      minute: options.includeTime ? '2-digit' : undefined,
      ...options,
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatCurrency(amount, currency = 'USD') {
  if (amount === undefined || amount === null || isNaN(amount)) return '—';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getStatusBadgeVariant(status) {
  switch (status?.toUpperCase()) {
    case 'ACCEPTED':
    case 'OPEN':
    case 'ACTIVE':
    case 'COMPLIANT':
    case 'MATCH':
    case 'VERIFIED':
      return 'success';
    case 'REJECTED':
    case 'CLOSED':
    case 'NON_COMPLIANT':
    case 'MISMATCH':
    case 'FAILED':
      return 'danger';
    case 'SUBMITTED':
    case 'UNDER_REVIEW':
    case 'IN_PROGRESS':
    case 'PENDING':
      return 'warning';
    default:
      return 'neutral';
  }
}
