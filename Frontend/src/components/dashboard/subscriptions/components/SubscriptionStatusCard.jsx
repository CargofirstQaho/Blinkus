import { useNavigate } from 'react-router-dom';
import { CalendarClock, Crown, ArrowUpRight } from 'lucide-react';
import { cn } from '../../../../lib/utils';

function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const PLAN_LABELS = {
  none: 'No active plan',
  monthly: 'Monthly Plan',
  sixMonth: 'Six Month Plan',
  yearly: 'Yearly Plan',
};

export default function SubscriptionStatusCard({ trade, compact = false }) {
  const navigate = useNavigate();
  const isActive = trade?.status === 'active' && trade?.unlimitedAccess;
  const planLabel = PLAN_LABELS[trade?.planType] ?? PLAN_LABELS.none;
  const expiry = formatDate(trade?.endDate);

  return (
    <div
      className={cn('rounded-2xl bg-white', compact ? 'p-4' : 'p-5 sm:p-6')}
      style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: isActive ? 'rgba(37,99,235,0.1)' : 'rgba(100,116,139,0.1)' }}
          >
            <Crown size={18} style={{ color: isActive ? '#2563eb' : '#64748b' }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: '#0f172a' }}>
              {isActive ? planLabel : 'Trade ERP'}
            </p>
            {isActive && expiry ? (
              <p className="text-xs flex items-center gap-1.5 mt-0.5" style={{ color: '#64748b' }}>
                <CalendarClock size={13} /> Renews / expires on {expiry}
              </p>
            ) : (
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                Subscribe to unlock full ERP access
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/trade/upgrade')}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: 'rgba(37,99,235,0.08)', color: '#1d4ed8' }}
        >
          {isActive ? 'Manage' : 'Upgrade'} <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
