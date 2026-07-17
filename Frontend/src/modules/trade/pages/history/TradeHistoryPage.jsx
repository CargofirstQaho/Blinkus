import { AnimatePresence } from 'motion/react';
import { History, AlertCircle, Ship } from 'lucide-react';
import { useUnifiedHistory } from '../../../../features/trade/history/hooks/useUnifiedHistory';
import HistoryItemCard from '../../../../features/trade/history/components/HistoryItemCard';
import HistoryFilterBar from '../../../../features/trade/history/components/HistoryFilterBar';

const BRAND = '#2563EB';
const LIGHT = '#EFF6FF';
const DARK  = '#0F172A';
const MUTED = '#64748B';
const GRAD  = 'linear-gradient(135deg, #1D4ED8, #2563EB)';

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: LIGHT }}>
        <Icon size={24} style={{ color: BRAND }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold" style={{ color: DARK }}>{title}</p>
        <p className="text-xs mt-1.5 max-w-xs" style={{ color: MUTED }}>{subtitle}</p>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl p-5 space-y-3" style={{ border: '1px solid #e2e8f0' }}>
          <div className="h-4 w-32 rounded animate-pulse" style={{ background: '#e2e8f0' }} />
          <div className="h-3 w-full rounded animate-pulse" style={{ background: '#f1f5f9' }} />
          <div className="h-3 w-2/3 rounded animate-pulse" style={{ background: '#f1f5f9' }} />
        </div>
      ))}
    </div>
  );
}

function Pagination({ pagination, page, setPage }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
        style={{ border: '1px solid #e2e8f0', color: MUTED }}
      >
        Previous
      </button>
      <span className="text-xs" style={{ color: MUTED }}>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
        disabled={page >= pagination.totalPages}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
        style={{ border: '1px solid #e2e8f0', color: MUTED }}
      >
        Next
      </button>
    </div>
  );
}

export default function TradeHistoryPage() {
  const {
    documents, pagination, loading, error,
    filters, updateFilter, resetFilters,
    searchQuery, setSearchQuery,
    sort, setSort,
    page, setPage,
  } = useUnifiedHistory();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: GRAD, boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
            <History size={20} color="white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: DARK }}>Trade History</h1>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>
              Every trade document — Contract, Commercial Invoice, Packing List, Proforma Invoice, Purchase Order, Credit Note, and Debit Note — in one place.
            </p>
          </div>
        </div>
      </div>

      <HistoryFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={updateFilter}
        sort={sort}
        onSortChange={setSort}
        onReset={resetFilters}
      />

      {loading && <SkeletonGrid />}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-12 gap-2.5">
          <AlertCircle size={28} style={{ color: '#ef4444' }} />
          <p className="text-sm font-semibold" style={{ color: DARK }}>Failed to load trade history</p>
          <p className="text-xs" style={{ color: MUTED }}>{error}</p>
        </div>
      )}

      {!loading && !error && documents.length === 0 && (
        <EmptyState
          icon={Ship}
          title="No Trade Documents Yet"
          subtitle="Create a Contract, Purchase Order, or any trade document to see it here."
        />
      )}

      {!loading && !error && documents.length > 0 && (
        <>
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {documents.map((doc) => (
                <HistoryItemCard key={`${doc.documentType}-${doc.id}`} doc={doc} />
              ))}
            </div>
          </AnimatePresence>
          <Pagination pagination={pagination} page={page} setPage={setPage} />
        </>
      )}
    </div>
  );
}
