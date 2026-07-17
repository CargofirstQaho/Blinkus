import { Check, X } from 'lucide-react';

export default function PlanFeatureList({ features, variant = 'default' }) {
  const isInverted = variant === 'inverted';

  return (
    <ul className="flex flex-col gap-2.5" role="list" aria-label="Plan features">
      {features.map((item) => {
        const label    = typeof item === 'string' ? item    : item.label;
        const included = typeof item === 'string' ? true   : item.included;

        return (
          <li key={label} className="flex items-center gap-2.5">
            <span
              className={
                included
                  ? isInverted
                    ? 'w-4 h-4 rounded-full bg-white/15 flex items-center justify-center shrink-0'
                    : 'w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center shrink-0'
                  : 'w-4 h-4 rounded-full bg-black/5 flex items-center justify-center shrink-0'
              }
              aria-hidden="true"
            >
              {included
                ? <Check size={10} className={isInverted ? 'text-white' : 'text-accent'} strokeWidth={3} />
                : <X    size={9}  className="text-black/30"                               strokeWidth={3} />
              }
            </span>
            <span
              className={
                included
                  ? isInverted
                    ? 'text-xs text-white/80 leading-snug'
                    : 'text-xs text-black/60 leading-snug'
                  : 'text-xs text-black/35 leading-snug'
              }
            >
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
