export const PLAN_LABELS = {
  none: 'Free Plan', monthly: 'Monthly Plan', sixMonth: 'Six Month Plan', yearly: 'Yearly Plan',
  FREE: 'Free Plan', MONTHLY: 'Monthly Plan', SIX_MONTHS: 'Six Month Plan', YEARLY: 'Yearly Plan',
};

export const STATUS_STYLES = {
  ACTIVE:   { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', dot: 'bg-emerald-500 animate-pulse' },
  active:   { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', dot: 'bg-emerald-500 animate-pulse' },
  EXPIRED:  { bg: '#fffbeb', border: '#fde68a', color: '#d97706', dot: 'bg-amber-400' },
  expired:  { bg: '#fffbeb', border: '#fde68a', color: '#d97706', dot: 'bg-amber-400' },
  CANCELLED:{ bg: '#fef2f2', border: '#fecaca', color: '#dc2626', dot: 'bg-red-400' },
  cancelled:{ bg: '#fef2f2', border: '#fecaca', color: '#dc2626', dot: 'bg-red-400' },
  none:     { bg: '#f8fafc', border: '#e2e8f0', color: '#64748b', dot: 'bg-slate-400' },
  FREE:     { bg: '#f8fafc', border: '#e2e8f0', color: '#64748b', dot: 'bg-slate-400' },
};

export const PAYMENT_STATUS_STYLES = {
  CAPTURED:   { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a' },
  CREATED:    { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
  FAILED:     { bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
  REFUNDED:   { bg: '#fffbeb', border: '#fde68a', color: '#d97706' },
  AUTHORIZED: { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a' },
};

export const SUPPORT_EMAIL = 'orbit@blinkus.ai';

export const ACCEPTED_VIA_LABELS = {
  signup:          'Signup',
  'google-auth':   'Google Sign-In',
  'policy-update': 'Policy Update',
};