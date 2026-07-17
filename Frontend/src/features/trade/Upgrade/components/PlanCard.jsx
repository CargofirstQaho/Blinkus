import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils.js';
import PlanFeatureList from './PlanFeatureList';
import UpgradeButton from './UpgradeButton';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function PlanCard({ plan, onUpgrade, loading = false }) {
  const { key, name, originalPrice, price, badge, billingLabel, features, popular } = plan;

  return (
    <motion.div
      variants={cardVariants}
      role="article"
      aria-label={`${name} plan`}
      className={cn(
        'relative bg-white rounded-2xl border flex flex-col overflow-hidden h-full',
        popular
          ? 'border-accent/30 shadow-lg shadow-accent/10'
          : 'border-black/5 shadow-sm'
      )}
    >
      {popular && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(90deg, transparent, #6495ED, transparent)',
          }}
        />
      )}

      <div className="p-6 flex flex-col gap-5 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-display font-bold text-black">{name}</h3>
          {badge && (
            <span className="inline-flex items-center px-2.5 py-1 bg-accent/10 text-accent text-[10px] font-bold rounded-full uppercase tracking-wide shrink-0 whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl font-display font-bold text-black" aria-label={`$${price}`}>
              ${price}
            </span>
            <span className="text-xs text-black/40 font-medium">{billingLabel}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs text-black/30 line-through"
              aria-label={`Original price $${originalPrice}`}
            >
              ${originalPrice}
            </span>
            {badge && (
              <span className="text-[10px] text-accent font-semibold">{badge}</span>
            )}
          </div>
        </div>

        <div className="w-full h-px bg-black/5" aria-hidden="true" />

        <div className="flex-1">
          <PlanFeatureList features={features} />
        </div>

        <UpgradeButton
          text="Upgrade Now"
          onClick={() => onUpgrade?.(key)}
          loading={loading}
          fullWidth
        />
      </div>
    </motion.div>
  );
}
