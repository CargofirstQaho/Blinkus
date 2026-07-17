import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Sparkles, FileText, Receipt, FileMinus, FileSignature,
  FileSpreadsheet, Package, FileCheck, ShieldCheck,
} from 'lucide-react';
import { useAiUsageLimit } from '../../hooks/useAiUsageLimit';

const PREMIUM_FEATURES = [
  { label: 'Unlimited AI Chat',                 icon: Sparkles },
  { label: 'Purchase Orders',                   icon: FileText },
  { label: 'Credit Notes',                      icon: Receipt },
  { label: 'Debit Notes',                       icon: FileMinus },
  { label: 'Contract Drafting',                 icon: FileSignature },
  { label: 'Proforma Invoice',                  icon: FileSpreadsheet },
  { label: 'Packing List',                      icon: Package },
  { label: 'Commercial Invoice',                icon: FileCheck },
  { label: 'Buyer & Seller Field Verification',  icon: ShieldCheck },
  { label: 'Supports in Global Partnerships',  icon: ShieldCheck },
  { label: 'Supports in Trade Finance and Insurance',  icon: ShieldCheck },
];

export default function AiUsageLimitBanner() {
  const navigate = useNavigate();
  const { limitReached, message, attemptId } = useAiUsageLimit();
  const [dismissed, setDismissed] = useState(false);

  const open = limitReached && !dismissed;

  useEffect(() => {
    setDismissed(false);
  }, [attemptId]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setDismissed(true);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="ai-limit-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setDismissed(true)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          <motion.div
            key="ai-limit-panel"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Free AI usage limit reached"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-black/20">
              <div className="relative p-4 sm:p-5">
                <button
                  type="button"
                  onClick={() => setDismissed(true)}
                  aria-label="Close"
                  className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <X size={16} className="text-black/40" />
                </button>

                <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-3">
                  <Sparkles size={17} />
                </div>

                <h3 className="text-sm sm:text-base font-bold text-black/85 pr-6 leading-snug">
                  You&apos;ve reached your free AI usage limit
                </h3>
                <p className="text-[11px] sm:text-xs text-black/45 leading-relaxed mt-1.5">
                  {message || "You've used all of your free AI conversations for this billing period."}
                  {' '}Upgrade your plan to continue chatting without limits and unlock powerful trade tools for your business.
                </p> 

                <h1 className='font-bold md:text-lg sm:text-sm  text-black '>Get Unlimited AI Chat and unlock all Blinkus Trade Features for just <span className='text-accent sm:text-lg md:text-xl'>$19.16</span></h1>

                <div className="grid grid-cols-2 gap-1.5 mt-3.5">
                  {PREMIUM_FEATURES.map(({ label, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-black/[0.02]"
                    >
                      <Icon size={12} className="text-accent shrink-0" />
                      <span className="text-[10px] leading-tight text-black/60 font-medium">{label}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/trade/upgrade')}
                  className="w-full mt-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors cursor-pointer"
                >
                  Upgrade to Blinkus Pro
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
