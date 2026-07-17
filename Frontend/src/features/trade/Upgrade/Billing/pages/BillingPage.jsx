import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useBillingAddresses } from '../hooks/useBillingAddresses';
import { useBillingSummary } from '../hooks/useBillingSummary';
import BillingAddressSection from '../components/BillingAddressSection';
import BillingSummaryCard from '../components/BillingSummaryCard';
import PaymentVerifyOverlay from '../components/PaymentVerifyOverlay';
import { PLANS } from '../../constants/plans';
import { apiCreateOrder, apiVerifyPayment } from '../services/paymentApi';
import { apiFetch } from '@/src/lib/apiFetch.js';
import { setUser } from '@/src/redux/slices/authSlice.js';
import { setErpSubscriptionState } from '@/src/redux/slices/subscriptionSlice.js';
import { setEntitlements } from '@/src/redux/slices/entitlementSlice.js';
import { clearAiUsageLimit } from '@/src/redux/slices/aiUsageSlice.js';
import { fetchErpSubscriptionStatus } from '@/src/services/erpSubscriptionApi.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function BillingPage() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const planState = location.state;

  const selectedPlan = planState?.planType
    ? PLANS.find((p) => p.key === planState.planType) ?? null
    : null;

  const {
    addresses,
    selected,
    loading,
    error,
    loadAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
  } = useBillingAddresses();

  const { summary, summaryLoading, calculateSummary } = useBillingSummary();

  const prevSelectedId = useRef(null);
  const verifyLock     = useRef(false);

  const [orderLoading,  setOrderLoading]  = useState(false);
  const [verifying,     setVerifying]     = useState(false);
  const [paymentError,  setPaymentError]  = useState(null);
  const [cancelMessage, setCancelMessage] = useState(null);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  useEffect(() => {
    if (!selected || !selectedPlan) return;
    if (prevSelectedId.current === selected._id) return;
    prevSelectedId.current = selected._id;
    calculateSummary(selectedPlan.key, selected._id);
  }, [selected, selectedPlan, calculateSummary]);

  const handleSelect = (address) => {
    selectAddress(address);
    setPaymentError(null);
    setCancelMessage(null);
  };

  const refreshStateAfterPayment = async () => {
    dispatch(clearAiUsageLimit());

    try {
      const meRes = await apiFetch(`${BACKEND_URL}/api/auth/me`);
      if (meRes.ok) {
        const meData = await meRes.json().catch(() => null);
        if (meData?.data?.user) {
          dispatch(setUser({ user: meData.data.user, usage: meData.data.usage ?? null }));
        }
      }
    } catch {}

    try {
      const subResult = await fetchErpSubscriptionStatus();
      const { subscription, entitlements } = subResult.data;
      dispatch(setErpSubscriptionState(subscription));
      dispatch(setEntitlements(entitlements));
    } catch {}
  };

  const handleProceedToPayment = async () => {
    if (!selected || !summary || !selectedPlan || orderLoading || verifying) return;

    if (!window.Razorpay) {
      setPaymentError('Payment service is not available. Please refresh the page and try again.');
      return;
    }

    setPaymentError(null);
    setCancelMessage(null);
    setOrderLoading(true);

    let orderResult;
    try {
      orderResult = await apiCreateOrder(selectedPlan.key, selected._id);
    } catch (err) {
      setPaymentError(err.message || 'Failed to initiate payment. Please try again.');
      setOrderLoading(false);
      return;
    }

    if (!orderResult?.success || !orderResult?.orderId) {
      setPaymentError('Invalid response from payment server. Please try again.');
      setOrderLoading(false);
      return;
    }

    setOrderLoading(false);

    const paymentSucceeded = { current: false };

    const rzpOptions = {
      key:         orderResult.razorpayKeyId,
      amount:      orderResult.amountInSmallestUnit,
      currency:    orderResult.currency,
      order_id:    orderResult.orderId,
      name:        'Blinkus.AI',
      description: selectedPlan.name,
      theme:       { color: '#6495ED' },
      prefill: {
        name:    selected.fullName,
        email:   selected.email,
        contact: selected.phone,
      },
      handler: async (response) => {
        if (verifyLock.current) return;
        verifyLock.current = true;
        paymentSucceeded.current = true;

        setVerifying(true);

        try {
          await apiVerifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
          );
          await refreshStateAfterPayment();
          navigate('/trade/add-organization');
        } catch (err) {
          verifyLock.current = false;
          setVerifying(false);
          setPaymentError(
            err.message ||
            'Payment verification failed. Please contact support if your payment was deducted.'
          );
        }
      },
      modal: {
        ondismiss: () => {
          if (paymentSucceeded.current) return;
          setCancelMessage('Payment was cancelled. No subscription has been activated.');
        },
      },
    };

    try {
      const rzp = new window.Razorpay(rzpOptions);
      rzp.open();
    } catch {
      setPaymentError('Failed to open payment window. Please refresh and try again.');
    }
  };

  const canProceed = !!selected && !!summary && !orderLoading && !verifying && !summaryLoading;

  if (!planState?.planType) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-sm text-black/50 mb-4">No plan selected. Please choose a plan to continue.</p>
        <button
          type="button"
          onClick={() => navigate('/trade/upgrade')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          style={{ background: 'linear-gradient(135deg, #5080d8 0%, #6495ED 100%)' }}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Plans
        </button>
      </div>
    );
  }

  return (
    <>
      {verifying && <PaymentVerifyOverlay />}

      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <button
            type="button"
            onClick={() => navigate('/trade/upgrade')}
            className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors mb-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg px-1"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to Plans
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold text-black mb-1">Billing Details</h1>
            <p className="text-sm text-black/40">
              Add or select a billing address to calculate your total with applicable taxes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 sm:p-6">
              <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-5">
                {addresses.length > 0 ? 'Your Billing Addresses' : 'Add Billing Address'}
              </p>

              <BillingAddressSection
                addresses={addresses}
                selected={selected}
                loading={loading}
                error={error}
                onSelect={handleSelect}
                onCreate={createAddress}
                onUpdate={updateAddress}
                onDelete={deleteAddress}
              />
            </div>

            <BillingSummaryCard
              plan={selectedPlan}
              summary={summary}
              summaryLoading={summaryLoading}
            />
          </div>

          <div className="mt-6">
            {paymentError && (
              <p className="text-sm text-red-600 mb-3 font-medium" role="alert">
                {paymentError}
              </p>
            )}
            {!paymentError && cancelMessage && (
              <p className="text-sm text-black/50 mb-3" role="status">
                {cancelMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={!canProceed}
              aria-label="Proceed to Payment"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6495ED] focus-visible:ring-offset-2"
              style={
                canProceed
                  ? { background: 'linear-gradient(135deg, #5080d8 0%, #6495ED 100%)', color: '#fff', cursor: 'pointer' }
                  : { background: '#e5e7eb', color: '#9ca3af', cursor: 'not-allowed' }
              }
            >
              {orderLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  Creating order...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
