import { useNavigate } from 'react-router-dom';
import { FilePlus, FolderOpen, ArrowRight } from 'lucide-react';

const BRAND  = '#2563EB';
const BRAND2 = '#1D4ED8';
const LIGHT  = '#EFF6FF';
const BORDER = '#BFDBFE';
const GRAD   = 'linear-gradient(135deg, #1D4ED8, #2563EB)';
const DARK   = '#0F172A';
const MUTED  = '#64748B';

export default function CreditNoteEntryPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: BRAND }}>Credit Note</h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          Create and manage your credit note documents.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/trade/domestic/credit-note/form')}
          className="flex flex-col items-start gap-4 p-6 rounded-2xl text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: GRAD, border: `2px solid ${BRAND2}` }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <FilePlus size={22} color="#fff" />
          </div>
          <div>
            <p className="font-bold text-base text-white">Generate New Credit Note</p>
            <p className="text-sm mt-1" style={{ color: '#BFDBFE' }}>
              Start creating a new Credit Note.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold mt-auto text-white">
            Get Started <ArrowRight size={14} color="#fff" />
          </div>
        </button>

        <button
          onClick={() => navigate('/trade/drafts')}
          className="flex flex-col items-start gap-4 p-6 rounded-2xl text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: '#fff', border: `2px solid ${BORDER}` }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: LIGHT }}>
            <FolderOpen size={22} color={BRAND} />
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: DARK }}>View Your Drafts</p>
            <p className="text-sm mt-1" style={{ color: MUTED }}>
              See and continue editing all your saved Credit Note drafts.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold mt-auto" style={{ color: BRAND }}>
            Go to Drafts <ArrowRight size={14} color={BRAND} />
          </div>
        </button>
      </div>
    </div>
  );
}
