import { motion } from 'motion/react';
import { Crown, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LockedFeatureScreen({
  moduleName,
  description = 'This Trade module is part of the Blinkus ERP suite and requires an active subscription.',
}) {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl px-6 py-12 sm:px-10 sm:py-16 text-center"
        style={{
          background: 'linear-gradient(135deg, #f0f6ff 0%, #e8f0fe 40%, #eff6ff 70%, #f8faff 100%)',
          border: '1px solid rgba(37,99,235,0.12)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 55% at 50% 30%, rgba(37,99,235,0.08) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.18)' }}
          >
            <Crown size={26} style={{ color: '#2563eb' }} />
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-display" style={{ color: '#0f172a' }}>
            {moduleName} is a Trade subscriber feature
          </h1>

          <p className="mt-3 text-sm sm:text-base max-w-xl leading-relaxed" style={{ color: '#475569' }}>
            {description}
          </p>

          <div
            className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium"
            style={{ background: 'rgba(37,99,235,0.07)', color: '#1d4ed8' }}
          >
            <ShieldCheck size={15} />
            Unlock all Trade modules + unlimited Chat for the duration of your plan
          </div>

          <button
            type="button"
            onClick={() => navigate('/trade/upgrade')}
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: '#2563eb' }}
          >
            View subscription plans <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
