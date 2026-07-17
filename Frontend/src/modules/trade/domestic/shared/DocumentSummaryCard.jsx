import { FileText, Hash, Package, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  draft:     { label: 'Draft',     bg: 'rgba(100,116,139,0.1)', color: '#475569' },
  pending:   { label: 'Pending',   bg: 'rgba(234,179,8,0.1)',   color: '#a16207' },
  approved:  { label: 'Approved',  bg: 'rgba(22,163,74,0.1)',   color: '#15803d' },
  rejected:  { label: 'Rejected',  bg: 'rgba(220,38,38,0.1)',   color: '#b91c1c' },
  cancelled: { label: 'Cancelled', bg: 'rgba(100,116,139,0.1)', color: '#475569' },
};

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2" style={{ borderBottom: '1px solid #f8fafc' }}>
      <span className="text-xs" style={{ color: '#64748b' }}>{label}</span>
      <span className="text-xs font-semibold truncate max-w-[140px] text-right" style={{ color: '#334155' }}>
        {value || '—'}
      </span>
    </div>
  );
}

export default function DocumentSummaryCard({
  documentType,
  docNumber,
  status = 'draft',
  itemCount = 0,
  subtotal = 0,
  totalTax = 0,
  grandTotal = 0,
}) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <div className="rounded-2xl bg-white overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>
          Document Preview
        </p>
      </div>

      <div className="px-4 py-3.5">
        <div className="flex items-center gap-3 mb-3.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(37,99,235,0.08)' }}
          >
            <FileText size={16} style={{ color: '#2563eb' }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight" style={{ color: '#0f172a' }}>{documentType}</p>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {cfg.label.toUpperCase()}
            </span>
          </div>
        </div>

        <Row label="Document No." value={docNumber} />
        <Row
          label="Line Items"
          value={`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
        />

        <div className="mt-3 rounded-xl p-3.5 space-y-1.5" style={{ background: '#f8fafc', border: '1px solid #e9edf2' }}>
          <div className="flex justify-between text-xs">
            <span style={{ color: '#64748b' }}>Subtotal</span>
            <span className="tabular-nums" style={{ color: '#334155' }}>{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: '#64748b' }}>Tax</span>
            <span className="tabular-nums" style={{ color: '#334155' }}>+ {totalTax.toFixed(2)}</span>
          </div>
          <div
            className="flex justify-between items-baseline pt-2"
            style={{ borderTop: '1px solid #e2e8f0' }}
          >
            <span className="text-xs font-bold" style={{ color: '#0f172a' }}>Grand Total</span>
            <span className="text-base font-bold tabular-nums" style={{ color: '#2563eb' }}>
              {grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {itemCount === 0 && (
          <div
            className="mt-3 flex items-center gap-2 p-2.5 rounded-xl"
            style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.2)' }}
          >
            <AlertCircle size={12} style={{ color: '#a16207', flexShrink: 0 }} />
            <p className="text-[11px]" style={{ color: '#a16207' }}>Add at least one line item</p>
          </div>
        )}
      </div>
    </div>
  );
}
