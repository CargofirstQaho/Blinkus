import { AnimatePresence, motion } from 'motion/react';
import PlanFeatureList from './PlanFeatureList';
import UpgradeButton from './UpgradeButton';

export default function PremiumPlanCard({ plan, onUpgrade }) {
  const { key, name, price, originalPrice, savings, badge, billingLabel, features } = plan;

  return (
    <div
      className="relative rounded-2xl flex flex-col overflow-hidden"
      role="article"
      aria-label="Blinkus Premium plan"
      style={{
        background:  'linear-gradient(145deg, #5478d8 0%, #6495ED 60%, #7aabf4 100%)',
        boxShadow:   '0 20px 60px -10px rgba(100,149,237,0.45)',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
      />

      <div className="p-6 sm:p-8 flex flex-col gap-5 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">
              Blinkus Premium
            </p>
            <h3 className="text-lg font-display font-bold text-white">{name}</h3>
          </div>
          {badge && (
            <span className="inline-flex items-center px-2.5 py-1 bg-white/15 text-white text-[10px] font-bold rounded-full uppercase tracking-wide shrink-0 whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-4xl font-display font-bold text-white">${price}</span>
              <span className="text-sm text-white/60 font-medium">{billingLabel}</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-sm text-white/40 line-through">${originalPrice}</span>
              <span className="text-xs text-emerald-300 font-semibold">Save ${savings}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="w-full h-px bg-white/10" aria-hidden="true" />

        <div className="flex-1">
          <PlanFeatureList features={features} variant="inverted" />
        </div>

        <UpgradeButton
          text="Upgrade Now"
          onClick={() => onUpgrade?.(key)}
          variant="inverted"
          fullWidth
        />
      </div>
    </div>
  );
}
