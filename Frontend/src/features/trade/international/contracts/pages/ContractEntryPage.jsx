import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FilePen, FileText, ArrowRight, FolderOpen, CheckCircle2, AlertCircle, Loader2, Clock } from 'lucide-react';
import { useContract } from '../hooks/useContract';

const BRAND  = '#2563EB';
const BRAND2 = '#1D4ED8';
const LIGHT  = '#EFF6FF';
const BORDER = '#BFDBFE';
const GRAD   = 'linear-gradient(135deg, #1D4ED8, #2563EB)';
const DARK   = '#0F172A';
const MUTED  = '#64748B';

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function ContractCard({ contract }) {
  const navigate = useNavigate();
  const isUpload = contract.contractMode === 'UPLOAD';
  const awaitingSignature = !isUpload && contract.activationStatus === 'AWAITING_SIGNATURE';

  return (
    <div
      className="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all hover:shadow-md"
      style={{ background: '#fff', border: `1px solid ${BORDER}` }}
      onClick={() => navigate(`/trade/international/contract-drafting/review?id=${contract._id}`)}
    >
      <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: LIGHT }}>
        {isUpload ? <Upload size={18} color={BRAND} /> : <FilePen size={18} color={BRAND} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-sm truncate" style={{ color: DARK }}>{contract.contractNumber}</p>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: LIGHT, color: BRAND }}>
            {isUpload ? 'Uploaded' : contract.contractType || 'Drafted'}
          </span>
          {awaitingSignature && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(234,179,8,0.12)', color: '#a16207' }}>
              <Clock size={11} /> Signed Contract Pending
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5 truncate" style={{ color: MUTED }}>
          Buyer: {contract.buyerName || '—'}  •  Seller: {contract.sellerName || '—'}
        </p>
        <p className="text-xs mt-0.5" style={{ color: MUTED }}>
          {fmtDate(contract.contractDate || contract.createdAt)}
          {contract.generatedAt && '  •  PDF Ready'}
        </p>
      </div>
      <ArrowRight size={16} color={MUTED} className="shrink-0 mt-0.5" />
    </div>
  );
}

export default function ContractEntryPage() {
  const navigate = useNavigate();
  const { contracts, loading, error, loadFinalized } = useContract();

  useEffect(() => {
    loadFinalized({ all: true });
  }, [loadFinalized]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: BRAND }}>International Trade Contracts</h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          All Proforma Invoices, Commercial Invoices and Packing Lists must be linked to a finalized contract.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3.5 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertCircle size={16} color="#DC2626" className="mt-0.5 shrink-0" />
          <p className="text-sm" style={{ color: '#DC2626' }}>{error}</p>
        </div>
      )}

      <button
        onClick={() => navigate('/trade/drafts')}
        className="w-full flex items-center justify-between gap-4 rounded-2xl p-5 text-left transition-all hover:shadow-md"
        style={{ background: LIGHT, border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GRAD }}>
            <FolderOpen size={18} color="#fff" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: BRAND }}>View Your Drafts</p>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>
              See and continue editing all your saved Contract drafts.
            </p>
          </div>
        </div>
        <ArrowRight size={16} color={BRAND} className="shrink-0" />
      </button>

      <div>
        <h2 className="text-base font-bold mb-4" style={{ color: DARK }}>Create a New Contract</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/trade/international/contract-drafting/upload')}
            className="flex flex-col items-start gap-4 p-6 rounded-2xl text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: '#fff', border: `2px solid ${BORDER}` }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: LIGHT }}>
              <Upload size={22} color={BRAND} />
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: DARK }}>Upload Existing Contract</p>
              <p className="text-sm mt-1" style={{ color: MUTED }}>
                Already have a signed contract? Upload it here (PDF, DOC, DOCX) and register it in the system.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold mt-auto" style={{ color: BRAND }}>
              Get Started <ArrowRight size={14} color={BRAND} />
            </div>
          </button>

          <button
            onClick={() => navigate('/trade/international/contract-drafting/draft')}
            className="flex flex-col items-start gap-4 p-6 rounded-2xl text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: GRAD, border: `2px solid ${BRAND2}` }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <FilePen size={22} color="#fff" />
            </div>
            <div>
              <p className="font-bold text-base text-white">Draft New Contract</p>
              <p className="text-sm mt-1" style={{ color: '#BFDBFE' }}>
                Build a professional trade contract from scratch with our guided form and clause library.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold mt-auto text-white">
              Start Drafting <ArrowRight size={14} color="#fff" />
            </div>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold mb-4" style={{ color: DARK }}>Finalized Contracts</h2>
        {loading && (
          <div className="flex items-center justify-center py-10 gap-2">
            <Loader2 size={20} className="animate-spin" style={{ color: BRAND }} />
            <p className="text-sm" style={{ color: MUTED }}>Loading contracts…</p>
          </div>
        )}
        {!loading && contracts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 rounded-2xl" style={{ background: LIGHT, border: `1px dashed ${BORDER}` }}>
            <FileText size={36} color={BORDER} />
            <p className="mt-3 text-sm font-semibold" style={{ color: MUTED }}>No finalized contracts yet</p>
            <p className="text-xs mt-1" style={{ color: MUTED }}>Create or upload a contract to get started</p>
          </div>
        )}
        {!loading && contracts.length > 0 && (
          <div className="space-y-2.5">
            {contracts.map(c => <ContractCard key={c._id} contract={c} />)}
          </div>
        )}
      </div>

      <div className="rounded-2xl p-4" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 size={16} color="#D97706" className="mt-0.5 shrink-0" />
          <p className="text-xs" style={{ color: '#92400E' }}>
            <strong>Business Rule:</strong> A finalized contract is required before you can create Proforma Invoices, Commercial Invoices, or Packing Lists. Once finalized, contracts cannot be edited or deleted.
          </p>
        </div>
      </div>
    </div>
  );
}
