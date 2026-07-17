import { FileText } from 'lucide-react';

const BADGES = [
  'Incoterms 2020',
  'Trade Compliance',
  'Arbitration Clauses',
  'Payment Terms',
  'LC Protection',
  'Risk Intelligence',
];

export default function ContractHero() {
  return (
    <div className="relative bg-white rounded-2xl border border-black/5 overflow-hidden p-6 sm:p-8 mb-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 90% 50%, rgba(100,149,237,0.07) 0%, transparent 70%)',
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent text-[10px] font-bold rounded-full uppercase tracking-widest">
            <FileText size={11} />
            Coming Soon
          </span>
        </div>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-black mb-3 leading-tight">
          Contract Drafting &amp;{' '}
          <span
            style={{
              background:           'linear-gradient(135deg, #6495ED 0%, #1252d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}
          >
            Trade Agreement Intelligence
          </span>
        </h1>

        <p className="text-black/55 text-sm sm:text-[15px] max-w-2xl leading-relaxed mb-6">
          Generate structured international trade agreements for importers, exporters,
          distributors, sourcing partners, and logistics providers — with AI-powered
          legal intelligence, Incoterms support, risk clauses, compliance checks, and
          digital workflow automation.
        </p>

        <div className="flex flex-wrap gap-2">
          {BADGES.map((name) => (
            <span
              key={name}
              className="px-3 py-1.5 bg-gray-50 border border-black/5 text-black/45 text-xs font-semibold rounded-lg"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
