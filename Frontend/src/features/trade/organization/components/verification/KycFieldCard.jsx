import { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion, Loader2, BadgeCheck } from 'lucide-react';

const STATUS_META = {
  verified: {
    label: 'Verified',
    icon: ShieldCheck,
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  failed: {
    label: 'Failed',
    icon: ShieldAlert,
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
  },
  pending: {
    label: 'Pending',
    icon: ShieldQuestion,
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
  },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pending;
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full"
      style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
    >
      <Icon size={12} />
      {meta.label}
    </span>
  );
}

export default function KycFieldCard({
  title,
  description,
  icon: Icon,
  placeholder,
  helperText,
  fieldData,
  onVerify,
  verifying,
}) {
  const [value, setValue] = useState(fieldData?.number ?? '');
  const status = fieldData?.status ?? 'pending';
  const isVerified = status === 'verified';

  const handleVerify = async () => {
    const trimmed = value.trim();
    if (trimmed.length < 4) return;
    await onVerify(trimmed);
  };

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6" style={{ border: '1px solid #e2e8f0' }}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.1)' }}>
              <Icon size={16} style={{ color: '#2563eb' }} />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#0f172a' }}>{title}</p>
            <p className="text-xs mt-0.5 truncate" style={{ color: '#64748b' }}>{description}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            placeholder={placeholder}
            disabled={isVerified}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all bg-white placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
            style={{ border: '1px solid #e2e8f0', color: '#0f172a' }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleVerify}
          disabled={verifying || isVerified || value.trim().length < 4}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-50 hover:opacity-90 active:scale-95 shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', boxShadow: '0 4px 14px rgba(37,99,235,0.28)' }}
        >
          {verifying ? <Loader2 size={15} className="animate-spin" /> : isVerified ? <BadgeCheck size={15} /> : null}
          {verifying ? 'Verifying...' : isVerified ? 'Verified' : 'Verify'}
        </button>
      </div>

      {helperText && (
        <p className="mt-2.5 text-xs" style={{ color: '#94a3b8' }}>{helperText}</p>
      )}
    </div>
  );
}
