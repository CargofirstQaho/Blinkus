import { memo } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/src/lib/utils.js';

function PricingFeatures({ features, highlighted = false }) {
  return (
    <ul className="space-y-3">
      {features.map((feature) => {
        const HighlightIcon = feature.highlight;
        return (
          <li key={feature.label} className="flex items-center gap-3 text-sm">
            {feature.included ? (
              <Check
                size={16}
                className={cn('shrink-0', highlighted ? 'text-white' : 'text-green-500')}
              />
            ) : (
              <X
                size={16}
                className={cn('shrink-0', highlighted ? 'text-white/30' : 'text-black/20')}
              />
            )}
            <span
              className={cn(
                'font-medium',
                feature.included
                  ? highlighted
                    ? 'text-white'
                    : 'text-black/80'
                  : highlighted
                    ? 'text-white/40'
                    : 'text-black/40'
              )}
            >
              {feature.label}
            </span>
            {HighlightIcon && feature.included && (
              <HighlightIcon
                size={14}
                className={cn('ml-auto shrink-0', highlighted ? 'text-white' : 'text-accent')}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default memo(PricingFeatures);
