import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, X } from 'lucide-react';
import { useFreePlanUsage } from '../../hooks/useFreePlanUsage';

export default function FreePlanUsageBanner() {
  const navigate = useNavigate();
  const { visible, limit, periodLabel, resetDate } = useFreePlanUsage();
  const [dismissed, setDismissed] = useState(false);

  if (!visible || dismissed) return null;

  return (
    <div className="relative max-w-4xl mx-auto mb-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-black/6  flex items-start gap-2.5 flex-wrap sm:flex-nowrap">
      <div className="w-6 h-6 rounded-lg bg-black/5 text-black/35 flex items-center justify-center shrink-0 mt-0.5">
        <Info size={12} />
      </div>
      <div className="flex-1 min-w-[200px] pr-5">
        <p className="text-[11px] sm:text-xs font-semibold text-black/70 leading-snug">
          You're currently on the Free Plan
        </p>
        <p className="text-[10px] sm:text-[11px] text-black/45 leading-snug mt-0.5">
          Ask up to {limit} questions each {periodLabel}
          {resetDate && <> — reset on {resetDate}</>}
          {'. Upgrade to '}
          <button
            type="button"
            onClick={() => navigate('/trade/upgrade')}
            className="font-semibold text-accent hover:underline cursor-pointer"
          >
            Blinkus Pro
          </button>
          {' for Unlimited Conversations.'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center rounded-md text-black/30 hover:bg-black/5 hover:text-black/60 transition-colors shrink-0 cursor-pointer"
      >
        <X size={11} />
      </button>
    </div>
  );
}
