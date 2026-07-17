import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Globe, TrendingUp, Shield, Cpu } from 'lucide-react';
import { selectUser } from '../../../redux/slices/authSlice';

const METRICS = [
  { icon: Globe,      label: 'Global markets'           },
  { icon: TrendingUp, label: 'Commodity pricing'  },
  { icon: Shield,     label: 'Compliance intelligence' },
  { icon: Cpu,        label: 'AI-powered analysis'     },
];

const INTELLIGENCE_ROWS = [
  { label: 'Commodity Index', value: '+2.4%',   color: '#059669', bar: 68  },
  { label: 'Trade Routes',    value: '12,840',  color: '#2563eb', bar: 85  },
  { label: 'Active Markets',  value: '180+',    color: '#2563eb', bar: 100 },
  { label: 'Risk Alerts',     value: '3 active', color: '#d97706', bar: 22  },
];

const NODES = [
  { x: 18,  y: 40, label: 'NYC' },
  { x: 72,  y: 18, label: 'LON' },
  { x: 112, y: 34, label: 'DXB' },
  { x: 148, y: 50, label: 'BOM' },
  { x: 180, y: 65, label: 'SIN' },
  { x: 202, y: 24, label: 'SHA' },
];

const EDGE_PATHS = [
  'M 18,40 Q 45,8 72,18',
  'M 72,18 Q 92,5 112,34',
  'M 112,34 Q 130,26 148,50',
  'M 148,50 Q 164,38 180,65',
  'M 180,65 Q 191,44 202,24',
  'M 72,18 Q 137,5 202,24',
  'M 18,40 Q 65,12 112,34',
];

export default function HeroBanner() {
  const navigate  = useNavigate();
  const user      = useSelector(selectUser);
  const firstName = user?.name?.split(' ')[0] || 'Trader';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl mb-8"
      style={{ border: '1px solid rgba(37,99,235,0.12)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, #f0f6ff 0%, #e8f0fe 40%, #eff6ff 70%, #f8faff 100%)',
        }}
      />

      <div
        className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(37,99,235,0.10) 0%, rgba(59,130,246,0.04) 45%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -left-20 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute -bottom-20 right-1/3 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 65%)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.055) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div className="relative z-10 p-6 sm:p-8 md:p-9 flex flex-col lg:flex-row lg:items-start gap-7 lg:gap-10">

        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5"
            style={{
              background: 'rgba(37,99,235,0.07)',
              borderColor: 'rgba(37,99,235,0.18)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-semibold tracking-wide" style={{ color: '#1d4ed8' }}>
              Intelligence Active
            </span>
            <span className="w-px h-3 mx-0.5" style={{ background: 'rgba(37,99,235,0.2)' }} />
            <span className="text-[10px] font-medium" style={{ color: '#64748b' }}>
              Global Trade OS
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-medium mb-2"
            style={{ color: '#64748b' }}
          >
            {greeting}, {firstName}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl sm:text-3xl lg:text-[2rem] xl:text-4xl font-bold leading-tight mb-4"
            style={{
              background: 'linear-gradient(140deg, #0f172a 0%, #1e40af 45%, #2563eb 100%)',
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
            className="text-sm leading-relaxed max-w-md mb-6"
            style={{ color: '#475569' }}
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
                <Icon size={12} style={{ color: '#3b82f6' }} className="shrink-0" />
                <span className="text-[11px] font-medium" style={{ color: '#64748b' }}>
                  {label}
                </span>
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
              onClick={() => navigate('/chat/new')}
              className="cursor-pointer flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                boxShadow: '0 4px 16px rgba(37,99,235,0.28), 0 0 0 1px rgba(37,99,235,0.2)',
              }}
            >
              <Sparkles size={15} />
              Chat with Blinkus Agent
              <ArrowRight size={14} />
            </motion.button>
            <span
              className="text-[11px] font-medium px-3 py-1.5 rounded-lg"
              style={{
                background: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.12)',
                color: '#64748b',
              }}
            >
              Powered by Blinkus AI
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="hidden lg:flex flex-col gap-3 w-[260px] xl:w-[280px] shrink-0"
        >
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(37,99,235,0.10)',
              boxShadow: '0 1px 8px rgba(37,99,235,0.06)',
            }}
          >
            {/* <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{
                borderBottom: '1px solid rgba(37,99,235,0.07)',
                background: 'rgba(239,246,255,0.7)',
              }}
            >
              <span
                className="text-[9px] font-bold uppercase tracking-[0.15em]"
                style={{ color: '#3b82f6' }}
              >
                Live Intelligence
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-medium" style={{ color: '#94a3b8' }}>
                  Real-time
                </span>
              </div>
            </div> */}

            {/* <div className="px-4 py-3 space-y-3">
              {INTELLIGENCE_ROWS.map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px]" style={{ color: '#94a3b8' }}>
                      {row.label}
                    </span>
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: row.color }}
                    >
                      {row.value}
                    </span>
                  </div>
                  <div
                    className="h-[3px] rounded-full overflow-hidden"
                    style={{ background: 'rgba(37,99,235,0.08)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${row.bar}%`,
                        background: `linear-gradient(90deg, ${row.color}cc, ${row.color}44)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div> */}
          </div>

          {/* <div
            className="rounded-xl px-4 py-3"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(37,99,235,0.10)',
              boxShadow: '0 1px 8px rgba(37,99,235,0.06)',
            }}
          >
            <div
              className="flex items-center justify-between mb-3"
            >
              <span
                className="text-[9px] font-bold uppercase tracking-[0.15em]"
                style={{ color: '#3b82f6' }}
              >
                Trade Network
              </span>
              <span className="text-[9px] font-medium" style={{ color: '#94a3b8' }}>
                6 hubs active
              </span>
            </div>

            <svg
              viewBox="0 0 220 90"
              className="w-full"
              aria-hidden="true"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <radialGradient id="lnode-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="ledge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {EDGE_PATHS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke="url(#ledge-grad)"
                  strokeWidth="0.8"
                  fill="none"
                  strokeDasharray="2 3"
                />
              ))}

              {NODES.map((node) => (
                <g key={node.label}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="6"
                    fill="url(#lnode-glow)"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="3.5"
                    fill="#ffffff"
                    stroke="#3b82f6"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                  <circle cx={node.x} cy={node.y} r="1.2" fill="#2563eb" />
                  <text
                    x={node.x}
                    y={node.y + 10}
                    textAnchor="middle"
                    fontSize="5"
                    fill="rgba(30,64,175,0.45)"
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div> */}

          <div
            className="rounded-xl px-4 py-3 flex items-center justify-between"
            style={{
              background: 'rgba(37,99,235,0.05)',
              border: '1px solid rgba(37,99,235,0.12)',
            }}
          >
            <div>
              <p
                className="text-[9px] font-bold uppercase tracking-[0.12em] mb-0.5"
                style={{ color: '#3b82f6' }}
              >
                AI Model Status
              </p>
              <p className="text-xs font-semibold" style={{ color: '#334155' }}>
                Blinkus Agent v1
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex gap-0.5 items-end">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full"
                    style={{
                      height: `${8 + i * 3}px`,
                      background: `rgba(37,99,235,${0.25 + i * 0.15})`,
                    }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-semibold" style={{ color: '#059669' }}>
                Ready
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
