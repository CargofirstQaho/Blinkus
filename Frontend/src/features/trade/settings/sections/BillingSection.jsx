import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Calendar, RefreshCw, CreditCard, MapPin, Mail, Phone, Building, Loader2, ChevronLeft, ChevronRight, ReceiptText } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectTradeSubscription } from '@/src/redux/slices/subscriptionSlice.js';
import { useCurrentSubscription } from '../hooks/useCurrentSubscription';
import { usePaymentHistory } from '../hooks/usePaymentHistory';
import { useBillingAddresses } from '@/src/features/trade/Upgrade/Billing/hooks/useBillingAddresses.js';
import SettingsSectionWrapper from '../components/SettingsSectionWrapper';
import { PAYMENT_STATUS_STYLES, PLAN_LABELS, STATUS_STYLES } from '../utils/constants';


function fmt(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtAmount(amount, currency) {
  if (amount == null) return '—';
  const sym = currency === 'INR' ? '₹' : '$';
  return `${sym}${Number(amount).toFixed(2)}`;
}

function daysRemaining(endDate) {
  if (!endDate) return null;
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function Skeleton({ className }) {
  return <div className={`bg-black/5 animate-pulse rounded-xl ${className}`} />;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5" style={{ borderBottom: '1px solid rgba(37,99,235,0.06)' }}>
      <span className="text-xs text-black/40 shrink-0">{label}</span>
      <span className="text-xs font-medium text-right truncate" style={{ color: '#334155' }}>{value || '—'}</span>
    </div>
  );
}

function AddressCard({ address }) {
  return (
    <div className="p-4 rounded-xl relative" style={{ border: '1px solid rgba(37,99,235,0.1)', background: 'rgba(37,99,235,0.02)' }}>
      {address.isDefault && (
        <span
          className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8' }}
        >
          Default
        </span>
      )}
      <p className="font-semibold text-sm pr-16" style={{ color: '#0f172a' }}>{address.fullName}</p>
      {address.companyName && <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{address.companyName}</p>}
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
          <Mail size={10} className="shrink-0" /> {address.email}
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
          <Phone size={10} className="shrink-0" /> {address.phone}
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
          <MapPin size={10} className="shrink-0" />
          {[address.addressLine1, address.city, address.state, address.postalCode, address.country].filter(Boolean).join(', ')}
        </div>
      </div>
    </div>
  );
}

export default function BillingSection() {
  const navigate = useNavigate();
  const trade    = useSelector(selectTradeSubscription);
  const { subscription: activeSub, loading: subLoading, loaded: subLoaded, load: loadSub } = useCurrentSubscription();
  const { payments, total, page, pages, loading: histLoading, loaded: histLoaded, load: loadHist } = usePaymentHistory();
  const { addresses, loading: addrLoading, loadAddresses } = useBillingAddresses();

  useEffect(() => {
    if (!subLoaded)  loadSub();
    if (!histLoaded) loadHist(1);
  }, [subLoaded, histLoaded, loadSub, loadHist]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const planLabel   = PLAN_LABELS[trade?.planType] ?? 'Free Plan';
  const statusStyle = STATUS_STYLES.active;
  const days        = daysRemaining(trade?.endDate);
  const isFreePlan  = !trade?.planType || trade.planType === 'none';
  const latestPayment = payments.find((p) => p.status === 'CAPTURED') ?? payments[0] ?? null;

  return (
    <SettingsSectionWrapper
      title="Billing"
      description="Manage your subscription, payments, addresses, and billing history."
    >
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#0f172a' }}>Current Plan</h3>
            <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>Your active subscription details</p>
          </div>
        </div>
        <div className="px-6 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.1)' }}>
              <Crown size={22} style={{ color: '#2563eb' }} />
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: '#0f172a' }}>{planLabel}</p>
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1.5"
                style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, color: statusStyle.color }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                Active
              </span>
            </div>
          </div>

          {isFreePlan ? (
            <div className="flex flex-col items-start gap-3 px-3 py-3 rounded-xl" style={{ background: 'rgba(37,99,235,0.03)', border: '1px solid rgba(37,99,235,0.07)' }}>
              <p className="text-xs" style={{ color: '#64748b' }}>
                You are currently using the Free plan. Upgrade to unlock subscription benefits and unlimited access.
              </p>
              <button
                type="button"
                onClick={() => navigate('/trade/upgrade')}
                className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
              >
                <Crown size={13} />
                Upgrade
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Start Date',    value: fmt(trade?.startDate) },
                { label: 'Expiry Date',   value: fmt(trade?.endDate)   },
                { label: 'Days Remaining', value: days != null ? (days === 0 ? 'Expired' : `${days} days`) : '—' },
                // {
                //   label: 'Auto Renewal',
                //   value: subLoading
                //     ? 'Loading...'
                //     : activeSub != null
                //       ? (activeSub.autoRenew ? 'Enabled' : 'Disabled')
                //       : '—',
                // },
                { label: 'Subscription Source', value: trade?.status === 'active' ? 'Direct Payment' : '—' },
                { label: 'Unlimited Access',    value: trade?.unlimitedAccess ? 'Yes' : 'No' },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(37,99,235,0.03)', border: '1px solid rgba(37,99,235,0.07)' }}>
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{label}</span>
                  <span className="text-xs font-medium" style={{ color: '#334155' }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
          <h3 className="font-bold text-sm" style={{ color: '#0f172a' }}>Last Payment</h3>
          <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>Most recent payment information</p>
        </div>
        <div className="px-6 py-4">
          {histLoading && !histLoaded ? (
            <div className="space-y-2.5">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8" />)}
            </div>
          ) : latestPayment ? (
            <>
              <InfoRow label="Payment Method"     value={latestPayment.paymentMethod || 'Online Payment'} />
              <InfoRow label="Payment Date"       value={fmt(latestPayment.paymentDate || latestPayment.createdAt)} />
              <InfoRow label="Plan"               value={PLAN_LABELS[latestPayment.planName] ?? latestPayment.planName} />
              <InfoRow label="Amount Paid"        value={fmtAmount(latestPayment.totalAmount, latestPayment.currency)} />
              <InfoRow label="Currency"           value={latestPayment.currency} />
              {/* {latestPayment.exchangeRate && latestPayment.currency === 'INR' && (
                <InfoRow label="Exchange Rate"    value={`1 USD = ₹${latestPayment.exchangeRate}`} />
              )} */}
              <InfoRow label="Transaction ID"     value={latestPayment.razorpayOrderId} />
              <InfoRow label="Razorpay Payment ID" value={latestPayment.razorpayPaymentId} />
              {/* <InfoRow label="Refund Status"      value={latestPayment.refundStatus} /> */}
              {/* {latestPayment.refundAmount > 0 && (
                <InfoRow label="Refund Amount"    value={fmtAmount(latestPayment.refundAmount, latestPayment.currency)} />
              )} */}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ReceiptText size={28} className="mb-3" style={{ color: '#cbd5e1' }} />
              <p className="text-sm font-medium" style={{ color: '#64748b' }}>No payment records found.</p>
              <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>You are currently using the Free plan.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
          <h3 className="font-bold text-sm" style={{ color: '#0f172a' }}>Billing Addresses</h3>
          <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>{addresses.length} address{addresses.length !== 1 ? 'es' : ''} saved</p>
        </div>
        <div className="px-6 py-4">
          {addrLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-24" />)}
            </div>
          ) : addresses.length > 0 ? (
            <div className="space-y-3">
              {addresses.map((addr) => <AddressCard key={addr._id} address={addr} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MapPin size={28} className="mb-3" style={{ color: '#cbd5e1' }} />
              <p className="text-sm font-medium" style={{ color: '#64748b' }}>No billing addresses saved.</p>
              <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Addresses are added during the checkout process.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
          <h3 className="font-bold text-sm" style={{ color: '#0f172a' }}>Billing History</h3>
          <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>{total} record{total !== 1 ? 's' : ''} total</p>
        </div>

        {histLoading && !histLoaded ? (
          <div className="px-6 py-4 space-y-2.5">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : payments.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(37,99,235,0.08)', background: 'rgba(37,99,235,0.02)' }}>
                    {['Date', 'Plan', 'Amount', 'Currency', 'Status', 'Method', 'Transaction ID'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-widest" style={{ color: '#94a3b8', fontSize: '9px', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const st = PAYMENT_STATUS_STYLES[p.status] ?? PAYMENT_STATUS_STYLES.CREATED;
                    return (
                      <tr key={p._id} style={{ borderBottom: '1px solid rgba(37,99,235,0.05)' }} className="hover:bg-black/1 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#475569' }}>
                          {fmt(p.paymentDate || p.createdAt)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium" style={{ color: '#334155' }}>
                          {PLAN_LABELS[p.planName] ?? p.planName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-semibold" style={{ color: '#0f172a' }}>
                          {fmtAmount(p.totalAmount, p.currency)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#64748b' }}>{p.currency}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-semibold" style={{ fontSize: '10px', background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap capitalize" style={{ color: '#64748b' }}>
                          {p.paymentMethod || '—'}
                        </td>
                        <td className="px-4 py-3 font-mono" style={{ color: '#94a3b8', fontSize: '10px', maxWidth: '140px' }}>
                          <span className="truncate block" title={p.razorpayOrderId}>
                            {p.razorpayOrderId || '—'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {pages > 1 && (
              <div className="px-6 py-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(37,99,235,0.08)' }}>
                <span className="text-xs" style={{ color: '#94a3b8' }}>Page {page} of {pages}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => loadHist(page - 1)}
                    disabled={page <= 1 || histLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
                    style={{ border: '1px solid #e2e8f0', color: '#64748b' }}
                  >
                    <ChevronLeft size={13} /> Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => loadHist(page + 1)}
                    disabled={page >= pages || histLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
                    style={{ border: '1px solid #e2e8f0', color: '#64748b' }}
                  >
                    Next <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="px-6 py-10 flex flex-col items-center justify-center text-center">
            <ReceiptText size={28} className="mb-3" style={{ color: '#cbd5e1' }} />
            <p className="text-sm font-medium" style={{ color: '#64748b' }}>You are currently using the Free plan.</p>
            <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>No billing records available.</p>
          </div>
        )}
      </div>
    </SettingsSectionWrapper>
  );
}
