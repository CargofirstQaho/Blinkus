import { Save, FileCheck } from 'lucide-react';

const STATUS_CONFIG = {
  draft:     { label: 'Draft',     bg: 'rgba(100,116,139,0.1)', color: '#475569' },
  pending:   { label: 'Pending',   bg: 'rgba(234,179,8,0.1)',   color: '#a16207' },
  approved:  { label: 'Approved',  bg: 'rgba(22,163,74,0.1)',   color: '#15803d' },
  rejected:  { label: 'Rejected',  bg: 'rgba(220,38,38,0.1)',   color: '#b91c1c' },
  cancelled: { label: 'Cancelled', bg: 'rgba(100,116,139,0.1)', color: '#475569' },
};

export default function DocumentActions({ documentType, status = 'draft', onSaveAsDraft }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <div
      className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm"
      style={{ borderBottom: '1px solid #e2e8f0' }}
    >
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 md:px-8 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-sm font-bold truncate" style={{ color: '#0f172a' }}>New {documentType}</span>
          <span
            className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {cfg.label.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onSaveAsDraft}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all hover:bg-slate-50 active:scale-[0.97]"
            style={{ border: '1px solid #e2e8f0', color: '#475569' }}
          >
            <Save size={14} />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
            }}
          >
            <FileCheck size={14} />
            <span className="hidden sm:inline">Save &amp; Generate</span>
            <span className="sm:hidden">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
