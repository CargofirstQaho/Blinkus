import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { getContractByIdApi } from '../../international/contracts/services/contractApi';
import { BRAND, LIGHT, BORDER, GRAD, MUTED } from './FormUI';

export default function ProformaContractSelect({ contracts, loading, value, onSelect, disabled }) {
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const [error, setError]       = useState('');

  const handleChange = useCallback(async (e) => {
    const id = e.target.value;
    if (!id) return;
    setFetching(true);
    setError('');
    try {
      const contract = await getContractByIdApi(id);
      onSelect && onSelect(contract);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  }, [onSelect]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-2xl mb-5" style={{ background: LIGHT, border: `1px solid ${BORDER}` }}>
        <Loader2 size={16} className="animate-spin" style={{ color: BRAND }} />
        <p className="text-sm" style={{ color: MUTED }}>Checking contracts…</p>
      </div>
    );
  }

  if (!contracts || contracts.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 p-5 rounded-2xl mb-5" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
        <div className="flex items-start gap-3">
          <AlertCircle size={18} color="#D97706" className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm" style={{ color: '#92400E' }}>No Finalized Contract Found</p>
            <p className="text-sm mt-1" style={{ color: '#92400E' }}>
              A finalized Contract is required before you can create a Proforma Invoice. Please finalize a contract
              first — Proforma Invoices cannot be created or generated without a valid linked contract.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/trade/international/contract-drafting')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: GRAD }}
        >
          <FileText size={14} /> Create a Contract <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl mb-5" style={{ background: LIGHT, border: `1px solid ${BORDER}` }}>
      <label className="text-xs font-semibold block mb-2" style={{ color: BRAND }}>
        Contract Number <span style={{ color: '#ef4444' }}>*</span>
      </label>
      <select
        value={value || ''}
        onChange={handleChange}
        disabled={disabled || fetching}
        className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all border-blue-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
      >
        <option value="">— Select a finalized contract —</option>
        {contracts.map((c) => (
          <option key={c._id} value={c._id}>
            {c.contractNumber}  •  Buyer: {c.buyerName || '—'}  •  Seller: {c.sellerName || '—'}
          </option>
        ))}
      </select>
      {fetching && <p className="text-xs mt-1.5 flex items-center gap-1.5" style={{ color: MUTED }}><Loader2 size={12} className="animate-spin" /> Loading contract details…</p>}
      {error && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{error}</p>}
      {!value && !fetching && !error && (
        <p className="text-xs mt-1.5" style={{ color: MUTED }}>
          Selecting a contract auto-populates Buyer, Seller, Commodity, Destination, Country and Terms below.
        </p>
      )}
    </div>
  );
}
