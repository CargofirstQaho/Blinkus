import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RefreshCw, X, Sparkles } from 'lucide-react';

const POLL_INTERVAL = 5 * 60 * 1000;
const RELOAD_FLAG   = 'blinkus_version_reloaded';

async function fetchRemoteVersion() {
  try {
    const res = await fetch(`/version.json?_=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.version ?? null;
  } catch {
    return null;
  }
}

export default function VersionChecker() {
  const [showBanner, setShowBanner] = useState(false);
  const baseVersion = useRef(null);

  useEffect(() => {
    let timer;

    const init = async () => {
      const version = await fetchRemoteVersion();
      if (!version) return;
      baseVersion.current = version;

      const justReloaded = sessionStorage.getItem(RELOAD_FLAG);
      if (justReloaded === version) {
        sessionStorage.removeItem(RELOAD_FLAG);
        return;
      }

      timer = setInterval(async () => {
        const latest = await fetchRemoteVersion();
        if (latest && baseVersion.current && latest !== baseVersion.current) {
          setShowBanner(true);
          clearInterval(timer);
        }
      }, POLL_INTERVAL);
    };

    init();

    return () => clearInterval(timer);
  }, []);

  const handleUpdate = () => {
    const latest = baseVersion.current;
    if (latest) sessionStorage.setItem(RELOAD_FLAG, latest);
    window.location.reload();
  };

  const handleDismiss = () => setShowBanner(false);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          key="version-banner"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.21, 1.11, 0.81, 0.99] }}
          className="fixed bottom-5 right-5 z-[9999] w-[calc(100vw-2.5rem)] max-w-sm"
          role="alert"
          aria-live="polite"
        >
          <div className="bg-white rounded-2xl border border-black/8 shadow-2xl shadow-black/10 p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-black leading-snug">
                  Update Available
                </p>
                <p className="text-xs text-black/50 mt-0.5 leading-relaxed">
                  A new version of Blinkus is ready. Refresh to get the latest experience.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleUpdate}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent text-white text-xs font-bold hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <RefreshCw size={11} />
                    Update Now
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="text-xs font-medium text-black/35 hover:text-black/60 transition-colors px-2 py-1.5"
                  >
                    Later
                  </button>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                aria-label="Dismiss update notification"
                className="p-1 rounded-lg hover:bg-black/5 text-black/30 hover:text-black/60 transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
