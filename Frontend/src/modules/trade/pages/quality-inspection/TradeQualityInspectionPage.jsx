import {
  ShieldCheck, UserPlus, FileText, Inbox, Scale, CheckCircle2, ExternalLink, Search,
} from 'lucide-react';

const BRAND  = '#2563EB';
const BRAND2 = '#1D4ED8';
const LIGHT  = '#EFF6FF';
const BORDER = '#BFDBFE';
const DARK   = '#0F172A';
const MUTED  = '#64748B';
const GRAD   = 'linear-gradient(135deg, #1D4ED8, #2563EB)';

const STEPS = [
  { icon: UserPlus,    text: 'Create your account in Qualty.ai' },
  { icon: FileText,    text: 'Post your inspection requirement' },
  { icon: Inbox,       text: 'Receive multiple quotations from inspection agencies' },
  { icon: Scale,       text: 'Compare quotations' },
  { icon: CheckCircle2, text: 'Choose the best inspection partner' },
];

const QUALTY_URL = 'https://www.qualty.ai';

export default function TradeQualityInspectionPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8 sm:space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
          style={{ background: LIGHT, border: `1px solid ${BORDER}` }}
        >
          <ShieldCheck size={26} style={{ color: BRAND }} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display" style={{ color: DARK }}>
          Quality Inspection
        </h1>
        <p className="text-sm sm:text-base mt-3 leading-relaxed" style={{ color: MUTED }}>
          Connect with trusted inspection agencies to verify product quality before shipment and reduce trade risks.
        </p>
      </div>

      <div
        className="rounded-2xl p-5 sm:p-8"
        style={{ background: '#fff', border: `1px solid ${BORDER}` }}
      >
        <h2 className="text-lg sm:text-xl font-bold text-center" style={{ color: DARK }}>
          Create your account in Qualty.ai
        </h2>

        <ol className="mt-8 space-y-0">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === STEPS.length - 1;
            return (
              <li key={step.text} className="flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: GRAD }}
                  >
                    {idx + 1}
                  </div>
                  {!isLast && <div className="w-px flex-1 my-1" style={{ background: BORDER, minHeight: '1.5rem' }} />}
                </div>
                <div className={`flex items-center gap-2.5 ${isLast ? 'pb-0' : 'pb-6'}`}>
                  <Icon size={16} style={{ color: BRAND }} className="shrink-0" />
                  <p className="text-sm sm:text-[15px] font-medium" style={{ color: DARK }}>{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-2 text-center">
          <a
            href={QUALTY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2"
            style={{ color: BRAND, ['--tw-ring-color']: BRAND }}
          >
            www.qualty.ai
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <a
        href={QUALTY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Qualty.ai inspection marketplace in a new tab"
        className="flex items-center gap-4 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2"
        style={{ background: '#fff', border: `2px solid ${BORDER}`, ['--tw-ring-color']: BRAND }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: LIGHT }}
        >
          <Search size={24} style={{ color: BRAND }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-base" style={{ color: DARK }}>Qualty.ai</p>
            <span
              className="text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0"
              style={{ background: LIGHT, color: BRAND }}
            >
              Inspection Marketplace
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Find certified inspection agencies for your export and import requirements.
          </p>
        </div>
        <ExternalLink size={18} style={{ color: MUTED }} className="shrink-0" />
      </a>
    </div>
  );
}
