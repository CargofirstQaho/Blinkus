import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Download, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usePackingList } from '../hooks/usePackingList';
import PackingListReview from '../components/PackingListReview';
import { BRAND, GRAD, LIGHT, MUTED } from '../components/FormUI';

export default function PackingListReviewPage() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const id        = params.get('id');
  const org = useSelector((s) => s.tradeOrganization.organization);
  const { draft, loading, generating, error, loadById, generatePdf } = usePackingList();
  const [confirmed, setConfirmed] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    if (id) loadById(id);
  }, [id, loadById]);

  useEffect(() => {
    if (draft?.pdfUrl && draft?.status === 'GENERATED') {
      setDownloadUrl(draft.pdfUrl);
    }
  }, [draft]);

  async function handleGenerate() {
    if (!id || !draft) return;
    const result = await generatePdf(id, draft);
    if (result?.pdfUrl) {
      setDownloadUrl(result.pdfUrl);
      setConfirmed(true);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3">
        <Loader2 size={28} className="animate-spin" style={{ color: BRAND }} />
        <p className="text-sm" style={{ color: MUTED }}>Loading packing list…</p>
      </div>
    );
  }

  if (error || !draft) {
    return (
      <div className="max-w-xl mx-auto mt-16 px-4">
        <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          <AlertCircle size={20} className="shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
          <div>
            <p className="font-semibold" style={{ color: '#B91C1C' }}>{error || 'Packing list not found'}</p>
            <button onClick={() => navigate('/trade/international/packing-list')} className="text-sm mt-2 underline" style={{ color: '#DC2626' }}>
              Back to Packing List form
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pl = draft;
  const isGenerated = pl.status === 'GENERATED' || confirmed;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <button onClick={() => navigate('/trade/international/packing-list')} className="flex items-center gap-1.5 text-sm mb-2 hover:opacity-70 transition-opacity" style={{ color: MUTED }}>
            <ArrowLeft size={14} /> Back to form
          </button>
          <h1 className="text-2xl font-extrabold" style={{ color: BRAND }}>Packing List Review</h1>
          <p className="text-sm mt-0.5 font-mono" style={{ color: MUTED }}>{pl.packingListNumber}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isGenerated ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: LIGHT, color: BRAND }}>
              <CheckCircle2 size={14} /> PDF Generated
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: LIGHT, color: BRAND }}>Draft</span>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          <AlertCircle size={16} className="shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
          <p className="text-sm" style={{ color: '#DC2626' }}>{error}</p>
        </div>
      )}

      <PackingListReview packingList={pl} org={org} />

      <div className="flex flex-col sm:flex-row gap-3 justify-end pb-8">
        {!isGenerated && (
          <button onClick={handleGenerate} disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: GRAD }}>
            {generating && <Loader2 size={16} className="animate-spin" />}
            {generating ? 'Generating…' : 'Generate PDF'}
          </button>
        )}
        {isGenerated && downloadUrl && (
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all"
            style={{ background: GRAD }}>
            <Download size={16} /> Open PDF
          </a>
        )}
      </div>
    </div>
  );
}
