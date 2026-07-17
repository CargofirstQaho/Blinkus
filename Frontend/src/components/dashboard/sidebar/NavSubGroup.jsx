import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { cn } from '../../../lib/utils';

export default function NavSubGroup({ icon: Icon, label, basePath, children }) {
  const { isCollapsed, isMobile } = useSidebar();
  const location = useLocation();
  const showText  = !isCollapsed || isMobile;
  const isActive  = location.pathname.startsWith(basePath);
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title={!showText ? label : undefined}
        aria-expanded={open}
        aria-label={label}
        className={cn(
          'w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all',
          showText ? 'px-3 py-2.5' : 'justify-center p-2.5',
          isActive
            ? 'text-black/80 bg-black/[0.04]'
            : 'text-black/60 hover:bg-black/5 hover:text-black'
        )}
      >
        {Icon && <Icon size={18} className="shrink-0" />}
        {showText && (
          <>
            <span className="flex-1 text-left">{label}</span>
            <ChevronDown
              size={14}
              className={cn('transition-transform duration-200 text-black/30', open && 'rotate-180')}
            />
          </>
        )}
      </button>

      {showText && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="sub-children"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="ml-3 pl-3 border-l border-black/5 space-y-0.5 py-0.5">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
