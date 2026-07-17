import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { useContract } from '../hooks/useContract';

const BRAND  = '#2563EB';
const BRAND2 = '#1D4ED8';
const LIGHT  = '#EFF6FF';
const BORDER = '#BFDBFE';
const GRAD   = 'linear-gradient(135deg, #1D4ED8, #2563EB)';
const MUTED  = '#64748B';
const DARK   = '#0F172A';

export default function ContractGate({ children, onContractSelected, selectedContractId }) {
  const navigate = useNavigate();
  const { contracts, loading, loadFinalized } = useContract();

  useEffect(() => {
    loadFinalized();
  }, [loadFinalized]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-2xl mb-5" style={{ background: LIGHT, border: `1px solid ${BORDER}` }}>
        <Loader2 size={16} className="animate-spin" style={{ color: BRAND }} />
        <p className="text-sm" style={{ color: MUTED }}>Checking contracts…</p>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <>
        <div className="flex flex-col items-start gap-4 p-5 rounded-2xl mb-5" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <div className="flex items-start gap-3">
            <AlertCircle size={18} color="#D97706" className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm" style={{ color: '#92400E' }}>No Finalized Contract Found</p>
              <p className="text-sm mt-1" style={{ color: '#92400E' }}>
                Create or upload a contract before generating international trade documents. All Proforma Invoices, Commercial Invoices, and Packing Lists must be linked to a finalized contract.
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
        {children}
      </>
    );
  }

  return (
    <>
      <div className="p-4 rounded-2xl mb-5" style={{ background: LIGHT, border: `1px solid ${BORDER}` }}>
        <label className="text-xs font-semibold block mb-2" style={{ color: BRAND }}>
          Linked Contract <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select
          value={selectedContractId || ''}
          onChange={e => onContractSelected && onContractSelected(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all border-blue-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">— Select a finalized contract —</option>
          {contracts.map(c => (
            <option key={c._id} value={c._id}>
              {c.contractNumber}  •  Buyer: {c.buyerName || '—'}  •  Seller: {c.sellerName || '—'}
            </option>
          ))}
        </select>
        {!selectedContractId && (
          <p className="text-xs mt-1.5" style={{ color: MUTED }}>
            Select the contract this document is linked to.
          </p>
        )}
      </div>
      {children}
    </>
  );
}
