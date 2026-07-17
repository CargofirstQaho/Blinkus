import { motion } from 'motion/react';
import { Zap, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils.js';

function getButtonStyle(variant, isInert) {
  if (isInert) {
    return { background: '#d1d5db', color: '#9ca3af' };
  }
  if (variant === 'inverted') {
    return {
      background:  '#ffffff',
      color:       '#6495ED',
      boxShadow:   '0 4px 14px rgba(0,0,0,0.12)',
    };
  }
  return {
    background:  'linear-gradient(135deg, #5080d8 0%, #6495ED 100%)',
    color:       '#ffffff',
    boxShadow:   '0 4px 18px rgba(100,149,237,0.38)',
  };
}

export default function UpgradeButton({
  text     = 'Upgrade Now',
  onClick,
  disabled = false,
  loading  = false,
  fullWidth = false,
  variant  = 'default',
}) {
  const isInert = disabled || loading;

  return (
    <motion.button
      whileHover={{ scale: isInert ? 1 : 1.02 }}
      whileTap={{ scale: isInert ? 1 : 0.97 }}
      type="button"
      onClick={onClick}
      disabled={isInert}
      aria-label={text}
      aria-busy={loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-opacity',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        fullWidth && 'w-full',
        isInert ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      )}
      style={getButtonStyle(variant, isInert)}
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin shrink-0" aria-hidden="true" />
      ) : (
        <Zap size={14} className="shrink-0" fill="currentColor" aria-hidden="true" />
      )}
      <span>{text}</span>
    </motion.button>
  );
}
