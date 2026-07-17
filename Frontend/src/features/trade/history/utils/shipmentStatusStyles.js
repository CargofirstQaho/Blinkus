export const SHIPMENT_STATUS_STYLES = {
  DRAFT:                  { label: 'Draft',                    bg: 'rgba(100,116,139,0.12)', color: '#475569' },
  GENERATED:              { label: 'Generated',                bg: 'rgba(22,163,74,0.12)',   color: '#15803d' },
  WAITING_FOR_SIGNATURE:  { label: 'Waiting for Signed Contract', bg: 'rgba(234,179,8,0.12)', color: '#a16207' },
  ACTIVE:                 { label: 'Active',                   bg: 'rgba(37,99,235,0.12)',   color: '#1d4ed8' },
  DOCUMENTS_IN_PROGRESS:  { label: 'Documents In Progress',     bg: 'rgba(217,119,6,0.12)',   color: '#b45309' },
  READY:                  { label: 'Ready',                    bg: 'rgba(22,163,74,0.12)',   color: '#15803d' },
  COMPLETED:              { label: 'Completed',                bg: 'rgba(22,163,74,0.16)',   color: '#166534' },
  CANCELLED:              { label: 'Cancelled',                bg: 'rgba(220,38,38,0.12)',   color: '#b91c1c' },
};

export const UNIFIED_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'GENERATED', label: 'Generated' },
  { value: 'WAITING_FOR_SIGNATURE', label: 'Waiting for Signed Contract' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DOCUMENTS_IN_PROGRESS', label: 'Documents In Progress' },
  { value: 'READY', label: 'Ready' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const UNIFIED_DOCUMENT_TYPE_OPTIONS = [
  { value: '', label: 'All Documents' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'COMMERCIAL_INVOICE', label: 'Commercial Invoice' },
  { value: 'PACKING_LIST', label: 'Packing List' },
  { value: 'PROFORMA_INVOICE', label: 'Proforma Invoice' },
  { value: 'PURCHASE_ORDER', label: 'Purchase Order' },
  { value: 'CREDIT_NOTE', label: 'Credit Note' },
  { value: 'DEBIT_NOTE', label: 'Debit Note' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'recentlyUpdated', label: 'Recently Updated' },
  { value: 'pendingFirst', label: 'Pending First' },
  { value: 'completedFirst', label: 'Completed First' },
];

export const DATE_RANGE_PRESETS = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '3m', label: 'Last 3 Months' },
  { value: '1y', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
];

export function resolveDateRangePreset(preset) {
  if (!preset || preset === 'custom') return { dateFrom: '', dateTo: '' };
  const now = new Date();
  const from = new Date(now);
  if (preset === 'today') from.setHours(0, 0, 0, 0);
  if (preset === '7d') from.setDate(now.getDate() - 7);
  if (preset === '30d') from.setDate(now.getDate() - 30);
  if (preset === '3m') from.setMonth(now.getMonth() - 3);
  if (preset === '1y') from.setFullYear(now.getFullYear() - 1);
  return { dateFrom: from.toISOString(), dateTo: now.toISOString() };
}
