import { motion } from 'motion/react';
import { Check, Sparkles, Gift, Clock } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export default function PlanCard({
  title,
  displayPrice,
  periodLabel,
  bonusMonths = 0,
  savingsPercent = 0,
  features = [],
  highlighted = false,
  ctaLabel = 'Choose plan',
  onSelect,
  disabled = false,
  comingSoon = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative flex flex-col rounded-2xl p-5 sm:p-6 h-full',
        'bg-white'
      )}
      style={{
        border: highlighted ? '1.5px solid #2563eb' : '1px solid rgba(37,99,235,0.12)',
        boxShadow: highlighted ? '0 8px 30px rgba(37,99,235,0.16)' : '0 1px 12px rgba(37,99,235,0.06)',
      }}
    >
      {comingSoon ? (
        <div
          className="absolute -top-3.5 left-5 z-10 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
          style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(15,23,42,0.08)' }}
        >
          <Clock size={12} /> Coming soon
        </div>
      ) : highlighted && (
        <div
          className="absolute -top-3.5 left-5 z-10 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
          style={{ background: '#2563eb', color: '#ffffff', boxShadow: '0 4px 12px rgba(37,99,235,0.32)' }}
        >
          <Sparkles size={12} /> Most popular
        </div>
      )}

      {savingsPercent > 0 && (
        <div
          className="absolute -top-3.5 right-5 z-10 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold"
          style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }}
        >
          Save {savingsPercent}%
        </div>
      )}

      <h3 className="text-base sm:text-lg font-bold mt-2" style={{ color: '#0f172a' }}>
        {title}
      </h3>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold font-display" style={{ color: '#1d4ed8' }}>
          {displayPrice}
        </span>
        {periodLabel && (
          <span className="text-xs sm:text-sm" style={{ color: '#64748b' }}>
            {periodLabel}
          </span>
        )}
      </div>

      {bonusMonths > 0 && (
        <div
          className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: 'rgba(37,99,235,0.07)', color: '#1d4ed8' }}
        >
          <Gift size={13} /> +{bonusMonths} bonus month{bonusMonths > 1 ? 's' : ''}
        </div>
      )}

      {features.length > 0 && (
        <ul className="mt-5 space-y-2.5 flex-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm" style={{ color: '#475569' }}>
              <Check size={16} className="shrink-0 mt-0.5" style={{ color: '#2563eb' }} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onSelect}
        disabled={disabled || comingSoon}
        className={cn(
          'mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200',
          'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
          !comingSoon && highlighted ? 'text-white hover:opacity-90' : 'hover:bg-accent/10'
        )}
        style={
          !comingSoon && highlighted
            ? { background: '#2563eb' }
            : { background: 'rgba(37,99,235,0.07)', color: '#1d4ed8' }
        }
      >
        {comingSoon ? 'Coming soon' : ctaLabel}
      </button>
    </motion.div>
  );
}
