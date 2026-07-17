import { memo } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils.js';

function PricingCard({
  title,
  price,
  originalPrice,
  priceSuffix,
  badge,
  savingsLabel,
  highlighted,
  ctaLabel,
  onSelect,
  children,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'glass-card relative flex flex-col h-full p-8 md:p-10 transition-shadow duration-300',
        highlighted
          ? 'bg-accent text-white border-0 shadow-[0_25px_60px_-15px_rgba(100,149,237,0.45)] hover:shadow-[0_35px_80px_-15px_rgba(100,149,237,0.55)]'
          : 'bg-white shadow-sm hover:shadow-xl'
      )}
    >
      <h2 className="font-display font-bold text-2xl md:text-3xl mb-6">{title}</h2>

      <div className="mb-2 flex items-baseline gap-2 flex-wrap">
        {originalPrice && (
          <span
            className={cn(
              'text-lg font-medium line-through',
              highlighted ? 'text-white/50' : 'text-black/30'
            )}
          >
            {originalPrice}
          </span>
        )}
        <span
          className={cn(
            'text-5xl font-display font-bold',
            highlighted ? 'text-white' : 'text-accent'
          )}
        >
          {price}
        </span>
        {priceSuffix && (
          <span
            className={cn('text-sm font-medium', highlighted ? 'text-white/70' : 'text-black/40')}
          >
            {priceSuffix}
          </span>
        )}
      </div>

      {(badge || savingsLabel) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {badge && (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
                highlighted ? 'bg-white/15 text-white' : 'bg-accent/10 text-accent'
              )}
            >
              {badge}
            </span>
          )}
          {savingsLabel && (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold',
                highlighted ? 'bg-white/15 text-white' : 'bg-green-50 text-green-600'
              )}
            >
              {savingsLabel}
            </span>
          )}
        </div>
      )}

      <div className={cn('flex-1 mb-8', !badge && !savingsLabel && 'mt-4')}>{children}</div>

      <button
        type="button"
        onClick={onSelect}
        className={cn(
          'w-full text-center rounded-full font-bold text-sm py-3 transition-all duration-300 active:scale-95',
          highlighted
            ? 'bg-white text-accent hover:opacity-90 hover:scale-105'
            : 'border border-black/20 hover:bg-black/5'
        )}
      >
        {ctaLabel}
      </button>
    </motion.div>
  );
}

export default memo(PricingCard);
