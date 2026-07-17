import { User, Shield, Lock, CreditCard, HelpCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils.js';

const NAV_ITEMS = [
  { id: 'general', icon: User,        label: 'General'  },
  { id: 'account', icon: Shield,      label: 'Account'  },
  { id: 'privacy', icon: Lock,        label: 'Privacy'  },
  { id: 'billing', icon: CreditCard,  label: 'Billing'  },
  { id: 'support', icon: HelpCircle,  label: 'Support'  },
];

export default function SettingsSidebar({ active, onChange }) {
  return (
    <>
      <div className="flex md:hidden w-full gap-1 overflow-x-auto scroll-smooth overscroll-x-contain pb-1 mb-6 no-scrollbar">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-all',
              active === id
                ? 'bg-accent text-white shadow-sm shadow-accent/20'
                : 'text-black/60 bg-white border border-black/5 hover:bg-black/3'
            )}
          >
            <Icon size={15} className="shrink-0" />
            {label}
          </button>
        ))}
      </div>

      <nav className="hidden md:flex flex-col gap-0.5 w-52 shrink-0 sticky top-6 self-start">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-black/30">
          Settings
        </p>
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full',
              active === id
                ? 'bg-accent/10 text-accent font-semibold'
                : 'text-black/60 hover:bg-black/5 hover:text-black'
            )}
          >
            <Icon size={16} className="shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}
