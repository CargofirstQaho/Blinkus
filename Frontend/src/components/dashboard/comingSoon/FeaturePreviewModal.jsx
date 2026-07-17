import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Sparkles } from 'lucide-react';

export default function FeaturePreviewModal({ module, onClose }) {
  return (
    <AnimatePresence>
      {module && (
        <>
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={module.name}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm rounded-2xl bg-white shadow-2xl shadow-black/20 overflow-hidden">
              <div
                className="relative p-6 flex flex-col items-center text-center gap-4"
                style={{
                  background: `linear-gradient(160deg, ${module.color}0e 0%, transparent 55%)`,
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-black/5 transition-colors"
                >
                  <X size={16} className="text-black/40" />
                </button>

                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mt-2"
                  style={{ backgroundColor: `${module.color}16` }}
                >
                  <module.icon size={30} style={{ color: module.color }} />
                </div>

                <div className="px-2">
                  <h3 className="text-base font-bold text-black/80">{module.name}</h3>
                  <p className="text-xs text-black/45 mt-1.5 leading-relaxed">{module.description}</p>
                </div>

                <div className="w-full p-4 rounded-xl bg-amber-50 border border-amber-100/80 flex items-start gap-3 text-left">
                  <Clock size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-700">Currently Under Development</p>
                    <p className="text-[11px] text-amber-600/70 mt-0.5 leading-relaxed">
                      Available soon. We&apos;re building this for global trade professionals.
                    </p>
                  </div>
                </div>

                <div className="w-full flex items-center gap-1.5 justify-center py-1">
                  <Sparkles size={11} className="text-accent/50" />
                  <span className="text-[11px] text-black/35 font-medium">
                    Part of the Blinkus Trade OS roadmap
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-black/5 hover:bg-black/8 text-sm font-semibold text-black/55 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
