import { motion } from 'motion/react';
import { useEntitlements } from '../hooks/useEntitlements';
import LockedFeatureScreen from './LockedFeatureScreen';
import Spinner from '../../../ui/Spinner';

export default function ErpModulePage({ moduleKey, moduleName, description, icon: Icon, children }) {
  const { erpModules, loaded } = useEntitlements();
  const unlocked = erpModules?.[moduleKey];

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!unlocked) {
    return <LockedFeatureScreen moduleName={moduleName} description={description} />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex items-center gap-3">
          {Icon && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(37,99,235,0.1)' }}
            >
              <Icon size={18} style={{ color: '#2563eb' }} />
            </div>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold" style={{ color: '#0f172a' }}>
              {moduleName}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>{description}</p>
          </div>
        </div>

        {children ?? (
          <div
            className="rounded-2xl p-8 sm:p-12 text-center"
            style={{ border: '1px dashed rgba(37,99,235,0.25)', background: 'rgba(37,99,235,0.03)' }}
          >
            <p className="text-sm" style={{ color: '#64748b' }}>
              {moduleName} workspace is being set up for your account. Check back soon.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
