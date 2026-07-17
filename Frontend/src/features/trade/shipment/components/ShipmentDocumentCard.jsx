import { memo } from 'react';
import { FileText, ArrowRight, Clock, Download } from 'lucide-react';
import { formatRelativeDate, formatFullDate } from '../../history/utils/historyUtils';

const BORDER = '#e2e8f0';
const MUTED  = '#64748b';
const TEXT   = '#0f172a';
const LIGHT  = '#f8fafc';

const STATUS_STYLES = {
  DRAFT:     { label: 'Draft',     bg: 'rgba(100,116,139,0.1)', color: '#475569' },
  GENERATED: { label: 'Generated', bg: 'rgba(22,163,74,0.12)',  color: '#15803d' },
  ACTIVE:    { label: 'Active',    bg: 'rgba(22,163,74,0.12)',  color: '#15803d' },
  AWAITING_SIGNATURE: { label: 'Awaiting Signature', bg: 'rgba(234,179,8,0.1)', color: '#a16207' },
};

function ShipmentDocumentCard({ color, label, number, status, updatedAt, pdfUrl, onOpen }) {
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.DRAFT;

  return (
    <div
      className="flex items-center gap-3 rounded-2xl p-4 bg-white transition-shadow hover:shadow-md cursor-pointer"
      style={{ border: `1px solid ${BORDER}` }}
      onClick={onOpen}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}1a` }}>
        <FileText size={16} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>{label}</p>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: statusStyle.bg, color: statusStyle.color }}>
            {statusStyle.label}
          </span>
        </div>
        <p className="text-sm font-bold truncate" style={{ color: TEXT }}>{number || 'Untitled'}</p>
        <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: MUTED }} title={formatFullDate(updatedAt)}>
          <Clock size={11} className="shrink-0" />
          <span>Updated {formatRelativeDate(updatedAt)}</span>
        </div>
      </div>
      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-lg transition-colors hover:bg-slate-50 shrink-0"
          style={{ border: `1px solid ${BORDER}`, color }}
          title="Download PDF"
        >
          <Download size={14} />
        </a>
      )}
      <ArrowRight size={16} style={{ color: MUTED }} className="shrink-0" />
    </div>
  );
}

export function ShipmentPlaceholderCard({ label }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl p-4 border-dashed"
      style={{ border: `1.5px dashed ${BORDER}`, background: LIGHT }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#e2e8f0' }}>
        <FileText size={16} style={{ color: MUTED }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: MUTED }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: MUTED }}>Coming soon</p>
      </div>
    </div>
  );
}

export default memo(ShipmentDocumentCard);
