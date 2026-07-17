import { useState } from 'react';
import { FileText, Copy, Trash2, Star, Building2, Clock } from 'lucide-react';
import { MODULE_COLORS } from '../../history/utils/historyUtils';
import { formatRelativeDate, formatFullDate } from '../../history/utils/historyUtils';
import { TO_HISTORY_MODULE } from '../hooks/useTradeDrafts';

const BORDER = '#e2e8f0';
const MUTED  = '#64748b';
const TEXT   = '#0f172a';
const LIGHT  = '#f8fafc';

export default function TradeDraftCard({ draft, moduleLabel, onOpen, onDuplicate, onDelete, onToggleFavorite }) {
  const [busy, setBusy] = useState(null);
  const color = MODULE_COLORS[TO_HISTORY_MODULE[draft.documentType]] || '#2563eb';

  async function runAction(key, fn) {
    if (busy) return;
    setBusy(key);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-4 sm:p-5 bg-white transition-shadow hover:shadow-md"
      style={{ border: `1px solid ${BORDER}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${color}1a` }}
          >
            <FileText size={16} style={{ color }} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider truncate" style={{ color }}>
              {moduleLabel(draft.documentType)}
            </p>
            <p className="text-sm font-bold truncate" style={{ color: TEXT }} title={draft.title}>
              {draft.title || 'Untitled Draft'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => runAction('favorite', () => onToggleFavorite(draft._id))}
          className="p-1.5 rounded-lg transition-colors hover:bg-slate-50 shrink-0"
          title={draft.favorite ? 'Remove from favorites' : 'Mark as favorite'}
        >
          <Star size={16} style={{ color: draft.favorite ? '#f59e0b' : '#cbd5e1' }} fill={draft.favorite ? '#f59e0b' : 'none'} />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 text-xs" style={{ color: MUTED }}>
        <div className="flex items-center gap-1.5 truncate">
          <Building2 size={12} className="shrink-0" />
          <span className="truncate">{draft.organization?.name || 'No organization'}</span>
        </div>
        <div className="flex items-center gap-1.5" title={`Created ${formatFullDate(draft.createdAt)}`}>
          <Clock size={12} className="shrink-0" />
          <span>Updated {formatRelativeDate(draft.updatedAt)}</span>
        </div>
        {draft.documentNumber && (
          <p className="font-mono text-[11px]" style={{ color: TEXT }}>{draft.documentNumber}</p>
        )}
      </div>

      <div className="flex items-center gap-2 mt-1 pt-3" style={{ borderTop: `1px solid ${LIGHT}` }}>
        <button
          type="button"
          onClick={() => onOpen(draft)}
          className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ background: color }}
        >
          Open
        </button>
        <button
          type="button"
          onClick={() => runAction('duplicate', () => onDuplicate(draft))}
          disabled={busy === 'duplicate'}
          className="p-2 rounded-lg transition-colors hover:bg-slate-50 disabled:opacity-50"
          style={{ border: `1px solid ${BORDER}`, color: MUTED }}
          title="Duplicate draft"
        >
          <Copy size={14} />
        </button>
        <button
          type="button"
          onClick={() => runAction('delete', () => onDelete(draft._id))}
          disabled={busy === 'delete'}
          className="p-2 rounded-lg transition-colors hover:bg-red-50 disabled:opacity-50"
          style={{ border: `1px solid ${BORDER}`, color: '#ef4444' }}
          title="Delete draft"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
