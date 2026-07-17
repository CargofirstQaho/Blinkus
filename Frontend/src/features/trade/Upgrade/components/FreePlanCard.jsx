import { Check } from 'lucide-react';
import PlanFeatureList from './PlanFeatureList';
import { FREE_PLAN_FEATURES } from '../constants/plans';

export default function FreePlanCard() {
  return (
    <div
      className="bg-white rounded-2xl border border-black/5 shadow-sm flex flex-col overflow-hidden"
      role="article"
      aria-label="Free plan"
    >
      <div className="p-6 sm:p-8 flex flex-col gap-5 flex-1">
        <div>
          <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-1.5">
            Current Plan
          </p>
          <h3 className="text-lg font-display font-bold text-black">Free Plan</h3>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-bold text-black">$0</span>
            <span className="text-sm text-black/40 font-medium">/ forever</span>
          </div>
          <div className="h-5 mt-1" aria-hidden="true" />
        </div>

        <div className="w-full h-px bg-black/5" aria-hidden="true" />

        <div className="flex-1">
          <PlanFeatureList features={FREE_PLAN_FEATURES} />
        </div>

        <button
          type="button"
          disabled
          aria-label="You are currently on the Free plan"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-black/5 text-black/35 cursor-not-allowed select-none"
        >
          <Check size={14} className="shrink-0" aria-hidden="true" />
          <span>Current Plan</span>
        </button>
      </div>
    </div>
  );
}
