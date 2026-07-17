import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import {
  UNIFIED_STATUS_OPTIONS, UNIFIED_DOCUMENT_TYPE_OPTIONS,
  SORT_OPTIONS, DATE_RANGE_PRESETS, resolveDateRangePreset,
} from '../utils/shipmentStatusStyles';

const BORDER = '#e2e8f0';
const MUTED  = '#64748b';
const DARK   = '#0f172a';
const BRAND  = '#2563eb';

function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-lg text-xs font-medium outline-none cursor-pointer"
      style={{ border: `1px solid ${BORDER}`, color: DARK, background: '#f8fafc' }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-lg text-xs outline-none w-full"
      style={{ border: `1px solid ${BORDER}`, color: DARK, background: '#f8fafc' }}
    />
  );
}

export default function HistoryFilterBar({ searchQuery, onSearchChange, filters, onFilterChange, sort, onSortChange, onReset }) {
  const [expanded, setExpanded] = useState(false);
  const [datePreset, setDatePreset] = useState('');

  const statusOptions = UNIFIED_STATUS_OPTIONS;
  const typeOptions    = UNIFIED_DOCUMENT_TYPE_OPTIONS;

  function handleDatePreset(preset) {
    setDatePreset(preset);
    if (preset !== 'custom') {
      const { dateFrom, dateTo } = resolveDateRangePreset(preset);
      onFilterChange('dateFrom', dateFrom);
      onFilterChange('dateTo', dateTo);
    }
  }

  return (
    <div className="rounded-xl bg-white p-3 space-y-2.5" style={{ border: `1px solid ${BORDER}` }}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#f8fafc', border: `1px solid ${BORDER}` }}>
          <Search size={13} style={{ color: MUTED }} />
          <input
            type="text"
            placeholder="Search contract, invoice, packing list, PO, CN, DN number, buyer, seller, commodity..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: DARK }}
          />
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          <Select value={filters.status} onChange={(v) => onFilterChange('status', v)} options={statusOptions} />
          <Select value={sort} onChange={onSortChange} options={SORT_OPTIONS} />
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors hover:bg-black/5"
            style={{ border: `1px solid ${BORDER}`, color: MUTED, background: '#fff' }}
          >
            <SlidersHorizontal size={13} /> Filters
            <ChevronDown size={12} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pt-2 flex flex-col gap-2.5" style={{ borderTop: `1px solid #f1f5f9` }}>
              <div className="flex flex-wrap gap-2">
                <Select value={filters.documentType} onChange={(v) => onFilterChange('documentType', v)} options={typeOptions} />
                <Select value={datePreset} onChange={handleDatePreset} options={DATE_RANGE_PRESETS} />
                {datePreset === 'custom' && (
                  <>
                    <input type="date" value={filters.dateFrom?.slice(0, 10) || ''} onChange={(e) => onFilterChange('dateFrom', e.target.value)}
                      className="px-3 py-2 rounded-lg text-xs outline-none" style={{ border: `1px solid ${BORDER}`, color: DARK, background: '#f8fafc' }} />
                    <input type="date" value={filters.dateTo?.slice(0, 10) || ''} onChange={(e) => onFilterChange('dateTo', e.target.value)}
                      className="px-3 py-2 rounded-lg text-xs outline-none" style={{ border: `1px solid ${BORDER}`, color: DARK, background: '#f8fafc' }} />
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <TextInput value={filters.country} onChange={(v) => onFilterChange('country', v)} placeholder="Country" />
                <TextInput value={filters.commodity} onChange={(v) => onFilterChange('commodity', v)} placeholder="Commodity" />
                <TextInput value={filters.buyer} onChange={(v) => onFilterChange('buyer', v)} placeholder="Buyer" />
                <TextInput value={filters.seller} onChange={(v) => onFilterChange('seller', v)} placeholder="Seller" />
              </div>

              <button
                type="button"
                onClick={() => { setDatePreset(''); onReset(); }}
                className="self-start flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg transition-opacity hover:opacity-75"
                style={{ color: '#dc2626' }}
              >
                <X size={12} /> Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
