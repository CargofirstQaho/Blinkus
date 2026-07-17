import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Globe, TrendingUp, Shield, Cpu } from 'lucide-react';

const METRICS = [
  { icon: Globe,      label: '180+ markets'           },
  { icon: TrendingUp, label: 'Live commodity pricing'  },
  { icon: Shield,     label: 'Compliance intelligence' },
  { icon: Cpu,        label: 'AI-powered analysis'     },
];

export default function HeroContent({ greeting, firstName, onChat }) {
  return (
    <div className="flex-1 min-w-0">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5"
        style={{
          background: 'rgba(37,99,235,0.12)',
          borderColor: 'rgba(59,130,246,0.25)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="text-xs font-semibold text-blue-400 tracking-wide">
          Intelligence Active
        </span>
        <span className="w-px h-3 bg-white/10 mx-0.5" />
        <span className="text-[10px] text-white/35 font-medium">Global Trade OS</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-sm font-medium text-white/45 mb-2"
      >
        {greeting}, {firstName}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl sm:text-3xl lg:text-[2rem] xl:text-4xl font-bold leading-tight mb-4"
        style={{
          background:
            'linear-gradient(140deg, #ffffff 0%, #e2e8f0 25%, #93c5fd 60%, #60a5fa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        The Intelligence Engine
        <br className="hidden sm:block" />
        {' '}for Global Trade
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-white/45 leading-relaxed max-w-md mb-6"
      >
        Monitor trade intelligence, discover opportunities, assess credibility, manage
        contracts, and interact with Blinkus AI from a unified trade command center.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-wrap gap-4 mb-7"
      >
        {METRICS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <Icon size={12} className="text-blue-400/60 shrink-0" />
            <span className="text-[11px] text-white/35 font-medium">{label}</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={onChat}
          aria-label="Chat with Blinkus Agent"
          className="flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
            boxShadow: '0 4px 24px rgba(37,99,235,0.35), 0 0 0 1px rgba(59,130,246,0.3)',
          }}
        >
          <Sparkles size={15} />
          Chat with Blinkus Agent
          <ArrowRight size={14} />
        </motion.button>

        <span
          className="text-[11px] font-medium px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          Powered by Blinkus AI
        </span>
      </motion.div>
    </div>
  );
}
