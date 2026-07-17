import { Search, FolderOpen, Star, AlertCircle } from 'lucide-react';
import Spinner from '../../../../components/ui/Spinner';
import { useTradeDrafts } from '../../../../features/trade/drafts/hooks/useTradeDrafts';
import TradeDraftCard from '../../../../features/trade/drafts/components/TradeDraftCard';

const DOCUMENT_TYPES = [
  'PurchaseOrder',
  'CreditNote',
  'DebitNote',
  'CommercialInvoice',
  'ProformaInvoice',
  'PackingList',
  'Contract',
];

const BORDER = '#e2e8f0';
const MUTED  = '#64748b';
const TEXT   = '#0f172a';
const BRAND  = '#2563eb';

export default function TradeDraftsPage() {
  const {
    drafts,
    totalCount,
    loading,
    error,
    organizations,
    searchQuery, setSearchQuery,
    selectedType, setSelectedType,
    selectedOrg, setSelectedOrg,
    onlyFavorites, setOnlyFavorites,
    sortOrder, setSortOrder,
    openDraft,
    deleteDraft,
    duplicateDraft,
    toggleFavorite,
    moduleLabel,
  } = useTradeDrafts();

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-display font-bold" style={{ color: TEXT }}>Drafts</h1>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>
          {totalCount} saved draft{totalCount === 1 ? '' : 's'} across all Trade documents
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drafts by title, number, or organization"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ border: `1px solid ${BORDER}` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg outline-none cursor-pointer"
            style={{ border: `1px solid ${BORDER}`, color: TEXT }}
          >
            <option value="ALL">All document types</option>
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>{moduleLabel(type)}</option>
            ))}
          </select>

          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg outline-none cursor-pointer"
            style={{ border: `1px solid ${BORDER}`, color: TEXT }}
          >
            <option value="ALL">All organizations</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg outline-none cursor-pointer"
            style={{ border: `1px solid ${BORDER}`, color: TEXT }}
          >
            <option value="recent">Recently updated</option>
            <option value="oldest">Oldest updated</option>
            <option value="created">Recently created</option>
          </select>

          <button
            type="button"
            onClick={() => setOnlyFavorites((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            style={
              onlyFavorites
                ? { background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309' }
                : { border: `1px solid ${BORDER}`, color: MUTED }
            }
          >
            <Star size={13} fill={onlyFavorites ? '#f59e0b' : 'none'} style={{ color: onlyFavorites ? '#f59e0b' : MUTED }} />
            Favorites
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
          <AlertCircle size={28} style={{ color: '#ef4444' }} />
          <p className="text-sm" style={{ color: MUTED }}>{error}</p>
        </div>
      ) : drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.1)' }}>
            <FolderOpen size={22} style={{ color: BRAND }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: TEXT }}>No drafts found</p>
          <p className="text-xs max-w-xs" style={{ color: MUTED }}>
            {totalCount === 0
              ? 'Drafts you save across any Trade document will show up here.'
              : 'No drafts match your current search or filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {drafts.map((draft) => (
            <TradeDraftCard
              key={draft._id}
              draft={draft}
              moduleLabel={moduleLabel}
              onOpen={openDraft}
              onDuplicate={duplicateDraft}
              onDelete={deleteDraft}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
