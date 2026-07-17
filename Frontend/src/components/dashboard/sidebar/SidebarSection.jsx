import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { cn } from '../../../lib/utils';

export default function SidebarSection({
  label,
  icon: Icon,
  collapsible = false,
  defaultOpen = true,
  className,
  children,
}) {
  const { isCollapsed, isMobile } = useSidebar();
  const [open, setOpen] = useState(defaultOpen);
  const showText = !isCollapsed || isMobile;

  return (
    <div className={cn('mt-1', className)}>
      {(label || Icon) && (
        <button
          type="button"
          onClick={() => collapsible && setOpen((o) => !o)}
          title={!showText && label ? label : undefined}
          className={cn(
            'w-full flex items-center gap-3 rounded-xl text-sm font-medium text-black/60 transition-all select-none',
            showText ? 'px-3 py-2.5' : 'justify-center p-2.5',
            collapsible ? 'hover:bg-black/5 hover:text-black cursor-pointer' : 'cursor-default'
          )}
        >
          {Icon && <Icon size={18} className="shrink-0" />}
          {showText && (
            <>
              <span className="flex-1 text-left">{label}</span>
              {collapsible && (
                <ChevronDown
                  size={14}
                  className={cn('transition-transform duration-200 text-black/30', open && 'rotate-180')}
                />
              )}
            </>
          )}
        </button>
      )}

      {collapsible ? (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="section-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-0.5 py-0.5">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div className="space-y-0.5 py-0.5">{children}</div>
      )}
    </div>
  );
}
