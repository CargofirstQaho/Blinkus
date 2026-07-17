import { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';
import { Sparkles, Rocket } from 'lucide-react';
import { usePricing } from '../components/dashboard/subscriptions/hooks/usePricing';
import { useEntitlements } from '../components/dashboard/subscriptions/hooks/useEntitlements';
import TradePlanList from '../components/dashboard/subscriptions/plans/TradePlanList';
// import SubscriptionStatusCard from '../components/dashboard/subscriptions/components/SubscriptionStatusCard';
import { createErpOrder } from '../services/erpSubscriptionApi';
import { SessionExpiredError } from '../lib/apiFetch';
import Spinner from '../components/ui/Spinner';

export default function Upgrade() {
  const { trade: tradePlans, loading, error } = usePricing();
  const { trade, featureFlags } = useEntitlements();
  const [selectingPlan, setSelectingPlan] = useState(null);
  const paymentEnabled = featureFlags?.erpPaymentEnabled;

  const handleSelectPlan = async (planType) => {
    if (!paymentEnabled) {
      toast.info('ERP plans are coming soon — all modules are free to use during early access.');
      return;
    }
    setSelectingPlan(planType);
    try {
      const result = await createErpOrder(planType);
      toast.info(result.message || 'Order created — checkout coming soon');
    } catch (err) {
      if (err instanceof SessionExpiredError) return;
      toast.error(err.message || 'Could not start checkout');
    } finally {
      setSelectingPlan(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-4 text-[11px] font-semibold uppercase tracking-wide"
            style={{ background: 'rgba(37,99,235,0.07)', color: '#1d4ed8', border: '1px solid rgba(37,99,235,0.18)' }}
          >
            <Sparkles size={13} /> Blinkus Trade ERP
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold" style={{ color: '#0f172a' }}>
            Upgrade to Trade ERP
          </h1>
          <p className="text-sm mt-1.5 max-w-2xl" style={{ color: '#64748b' }}>
            Unlock Add Organization, Domestic, International and Trade History modules — plus
            unlimited Chat with the Blinkus Agent for the full duration of your plan.
          </p>
        </div>

        {!paymentEnabled && (
          <div
            className="mb-6 rounded-2xl p-4 sm:p-5 flex items-start gap-3"
            style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(37,99,235,0.1)' }}
            >
              <Rocket size={16} style={{ color: '#2563eb' }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#0f172a' }}>
                Early Access Enabled
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                All ERP modules are currently available for free during the product development phase.
                The plans below show our planned future pricing — no payment is required right now.
              </p>
            </div>
          </div>
        )}

        <div className="mb-6">
          {/* <SubscriptionStatusCard trade={trade} /> */}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        )}

        {!loading && error && (
          <div
            className="rounded-2xl p-6 text-sm text-center"
            style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)', color: '#b91c1c' }}
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <TradePlanList
            plans={tradePlans}
            onSelectPlan={handleSelectPlan}
            selectingPlan={selectingPlan}
            comingSoon={!paymentEnabled}
          />
        )}

        <p className="mt-8 text-xs text-center" style={{ color: '#94a3b8' }}>
          {paymentEnabled
            ? 'Prices shown include applicable bonus months for first-time purchases of that plan type. Secure payments are processed via Razorpay.'
            : 'Future pricing shown for reference — bonus months will apply to first-time purchases of each plan type once payments go live.'}
        </p>
      </motion.div>
    </div>
  );
}
