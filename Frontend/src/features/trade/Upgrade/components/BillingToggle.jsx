import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils.js';

const DEFAULT_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual',  label: 'Annual'  },
];

export default function BillingToggle({ value = 'monthly', onChange, options = DEFAULT_OPTIONS }) {
  return (
    <div
      role="group"
      aria-label="Select billing cycle"
      className="inline-flex items-center bg-black/5 rounded-xl p-1 gap-0.5"
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange?.(opt.value)}
            aria-pressed={isActive}
            className={cn(
              'relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
              isActive ? 'text-black' : 'text-black/40 hover:text-black/70'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="billing-toggle-active"
                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
                aria-hidden="true"
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
