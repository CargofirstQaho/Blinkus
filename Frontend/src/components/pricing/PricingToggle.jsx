import { memo } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils.js';

function PricingToggle({ options, selected, onChange }) {
  return (
    <div className="inline-flex items-center gap-1 bg-accent p-1.5 rounded-full">
      {options.map((option) => {
        const isActive = selected === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              'relative px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors duration-300',
              isActive ? 'text-accent' : 'text-white/80 hover:text-white'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="pricing-toggle-active"
                className="absolute inset-0 bg-white rounded-full shadow-sm"
                transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default memo(PricingToggle);
