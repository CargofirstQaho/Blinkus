import { AnimatePresence, motion } from 'motion/react';
import { Loader2, MapPin } from 'lucide-react';

function SummaryRow({ label, value, sub, bold }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className={bold ? 'font-semibold text-black' : 'text-black/50'}>{label}</span>
      <div className="text-right">
        <span className={bold ? 'font-bold text-black' : 'text-black/70'}>{value}</span>
        {sub && <p className="text-[10px] text-black/30 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
      <span
        className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
        style={{ background: '#f3f4f6' }}
        aria-hidden="true"
      >
        <MapPin size={18} className="text-black/25" />
      </span>
      <p className="text-sm text-black/40 leading-relaxed">
        Select a billing address to view pricing details.
      </p>
    </div>
  );
}

function formatAmount(amount, currency) {
  if (currency === 'INR') return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${amount.toFixed(2)}`;
}

export default function BillingSummaryCard({ plan, summary, summaryLoading }) {
  const planName = plan ? `${plan.name} Plan` : '—';
  const planDuration = planName=="Yearly Plan"?"12":"6"

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden sticky top-6">
      <div className="px-5 py-4 border-b border-black/5">
        <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Order Summary</p>
        <p className="text-base font-display font-bold text-black mt-0.5">Blinkus Premium — {planName}</p>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {summaryLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8"
            >
              <Loader2 size={20} className="animate-spin text-accent" />
            </motion.div>
          )}

          {!summaryLoading && !summary && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState />
            </motion.div>
          )}

          {!summaryLoading && summary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              <SummaryRow
                label="Plan"
                value={planName}
              />
              <SummaryRow
                label="Currency"
                value={summary.currency}
              />
              <SummaryRow
                label="Plan Cost"
                value={formatAmount(summary.planAmount, summary.currency)}
                sub={
                  summary.currency === 'INR'
                    ? `$${summary.billingAddress ? plan?.price ?? '' : ''} USD × ${planDuration}  x ₹${summary.exchangeRate?.toFixed(2)}/USD`
                    : undefined
                }
              />

              {summary.currency === 'INR' && (
                <SummaryRow
                  label={`GST (${(summary.gstRate * 100).toFixed(0)}%)`}
                  value={`+ ${formatAmount(summary.gstAmount, 'INR')}`}
                />
              )}

              <div className="border-t border-black/5 pt-3 mt-1">
                <SummaryRow
                  label="Total Due"
                  value={formatAmount(summary.totalAmount, summary.currency)}
                  bold
                />
              </div>

              {summary.currency === 'INR' && (
                <p className="text-[10px] text-black/30 mt-1 leading-relaxed">
                  Exchange rate: 1 USD = ₹{summary.exchangeRate?.toFixed(2)}. GST of 18% applies to India billing.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
