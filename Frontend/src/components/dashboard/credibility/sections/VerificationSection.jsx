import { ShieldCheck, ExternalLink } from 'lucide-react';
import VerificationForm from '../components/VerificationForm';

export default function VerificationSection() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden mb-6">
      <div className="p-5 sm:p-6 border-b border-black/5 flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-base text-black mb-1">
            Importer / Exporter Verification
          </h2>
          <p className="text-xs text-black/50 leading-relaxed max-w-xl">
            Submit trade partner details for multi-source credibility verification across
            registered credit agencies, export bureaus, and international risk platforms.
          </p>
        </div>
        <a
          href="https://www.ecgc.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 shrink-0 bg-accent hover:bg-accent/90 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap self-start"
        >
          <ShieldCheck size={14} />
          Verify Buyer in ECGC
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="p-5 sm:p-6">
        <VerificationForm />
      </div>
    </div>
  );
}
