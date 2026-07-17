import { AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

const VARIANTS = {
  warning: {
    icon: AlertTriangle,
    color: '#b45309',
    iconBg: 'rgba(217,119,6,0.12)',
    background: '#fffbeb',
    border: '#fde68a',
  },
  success: {
    icon: ShieldCheck,
    color: '#15803d',
    iconBg: 'rgba(22,163,74,0.12)',
    background: '#f0fdf4',
    border: '#bbf7d0',
  },
  pending: {
    icon: Clock,
    color: '#a16207',
    iconBg: 'rgba(234,179,8,0.12)',
    background: '#fffbeb',
    border: '#fde68a',
  },
};

export default function OrganizationNoticeCard({ variant = 'warning', title, message }) {
  const meta = VARIANTS[variant] || VARIANTS.warning;
  const Icon = meta.icon;

  return (
    <div
      className="rounded-2xl p-4 sm:p-5 flex items-start gap-3"
      style={{ background: meta.background, border: `1px solid ${meta.border}` }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: meta.iconBg }}>
        <Icon size={16} style={{ color: meta.color }} />
      </div>
      <div className="min-w-0">
        {title && (
          <p className="text-sm font-semibold" style={{ color: meta.color }}>{title}</p>
        )}
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: meta.color }}>{message}</p>
      </div>
    </div>
  );
}
