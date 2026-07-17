import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BillingToggle from '../components/BillingToggle';
import FreePlanCard from '../components/FreePlanCard';
import PremiumPlanCard from '../components/PremiumPlanCard';
import { PLANS } from '../constants/plans';

const TOGGLE_OPTIONS = PLANS.map((p) => ({ value: p.key, label: p.name }));

export default function Upgrade() {
  const [activePlanKey, setActivePlanKey] = useState('YEARLY');
  const navigate = useNavigate();

  const selectedPlan = useMemo(
    () => PLANS.find((p) => p.key === activePlanKey),
    [activePlanKey]
  );

  const handleUpgrade = () => {
    navigate('/trade/upgrade/billing', {
      state: {
        planType:       selectedPlan.key,
        durationLabel:  selectedPlan.name,
        amount:         selectedPlan.price,
        originalAmount: selectedPlan.originalPrice,
        savings:        selectedPlan.savings,
        badge:          selectedPlan.badge,
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full mb-4">
            <Zap size={11} className="text-accent shrink-0" fill="currentColor" aria-hidden="true" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Upgrade</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-black mb-2 leading-tight">
            Upgrade Your Blinkus Experience
          </h1>

          <p className="text-sm text-black/50 leading-relaxed max-w-xl mx-auto">
            Unlock premium trade tools, credibility verification, ERP workflows, and unlimited AI assistance.
          </p>
        </div>

        <div className="flex justify-center mb-10" role="navigation" aria-label="Plan duration">
          <BillingToggle
            options={TOGGLE_OPTIONS}
            value={activePlanKey}
            onChange={setActivePlanKey}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-3xl mx-auto">
          <FreePlanCard />
          <PremiumPlanCard plan={selectedPlan} onUpgrade={handleUpgrade} />
        </div>

        <p className="text-xs text-black/25 text-center mt-8 leading-relaxed">
          Prices and plans are subject to change at Cargofirst's discretion.
        </p>
      </motion.div>
    </div>
  );
}
