import { ShieldCheck, ExternalLink } from 'lucide-react';

const PARTNER_BADGES = ['ECGC', 'COFACE', 'D&B', 'CreditSafe', 'EXIM Intelligence'];

export default function CredibilityHero() {
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
            <ShieldCheck size={11} />
            Coming soon
          </span>
        </div>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-black mb-3 leading-tight">
          Buyer &amp; Seller{' '}
          <span
            style={{
              background:           'linear-gradient(135deg, #6495ED 0%, #1252d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}
          >
            Credibility Intelligence
          </span>
        </h1>

        <p className="text-black/55 text-sm sm:text-[15px] max-w-2xl leading-relaxed mb-6">
          A unified platform for trade partner verification and risk intelligence. Upcoming
          integrations with ECGC, COFACE, Dun &amp; Bradstreet, and global export credit
          agencies will power real-time credibility scoring for importers and exporters
          across international markets.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://www.ecgc.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
          >
            <ShieldCheck size={15} />
            Verify Buyer in ECGC
            <ExternalLink size={12} />
          </a>

          <div className="flex flex-wrap gap-2">
            {PARTNER_BADGES.map((name) => (
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
    </div>
  );
}
