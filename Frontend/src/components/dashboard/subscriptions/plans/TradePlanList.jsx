import PlanCard from '../cards/PlanCard';

const PLAN_FEATURES = [
  'Add Organization workspace',
  'Domestic & International trade modules',
  'Full Trade History access',
  'Unlimited Chat with Blinkus Agent',
];

const PLAN_META = {
  monthly: { title: 'Monthly', periodLabel: '/ month' },
  sixMonth: { title: 'Six Month', periodLabel: '/ 6 months' },
  yearly: { title: 'Yearly', periodLabel: '/ year' },
};

export default function TradePlanList({ plans, onSelectPlan, selectingPlan, comingSoon = false }) {
  if (!plans) return null;

  const order = ['monthly', 'sixMonth', 'yearly'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {order.map((key) => {
        const plan = plans[key];
        if (!plan) return null;
        const meta = PLAN_META[key];

        return (
          <PlanCard
            key={key}
            title={meta.title}
            displayPrice={plan.displayPrice || `₹${plan.price}`}
            periodLabel={meta.periodLabel}
            bonusMonths={plan.bonusMonthsAvailable ?? plan.bonusMonths ?? 0}
            savingsPercent={plan.savingsPercent ?? 0}
            features={PLAN_FEATURES}
            highlighted={key === 'sixMonth'}
            ctaLabel={selectingPlan === key ? 'Processing…' : 'Choose plan'}
            disabled={Boolean(selectingPlan)}
            comingSoon={comingSoon}
            onSelect={() => onSelectPlan?.(key)}
          />
        );
      })}
    </div>
  );
}
