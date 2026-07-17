import { motion } from 'motion/react';

const INTELLIGENCE_ROWS = [
  { label: 'Commodity Index', value: '+2.4%', color: '#34d399', bar: 68 },
  { label: 'Trade Routes',    value: '12,840', color: '#60a5fa', bar: 85 },
  { label: 'Active Markets',  value: '180+',   color: '#60a5fa', bar: 100 },
  { label: 'Risk Alerts',     value: '3 active', color: '#fbbf24', bar: 22 },
];

const NODES = [
  { x: 18,  y: 40, label: 'NYC',  size: 4.5 },
  { x: 72,  y: 18, label: 'LON',  size: 4   },
  { x: 112, y: 34, label: 'DXB',  size: 3.5 },
  { x: 148, y: 50, label: 'BOM',  size: 3.5 },
  { x: 180, y: 65, label: 'SIN',  size: 4   },
  { x: 202, y: 24, label: 'SHA',  size: 4.5 },
];

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [1, 5], [0, 2],
];

function lerp(a, b, t) { return a + (b - a) * t; }

export default function HeroStats() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="hidden lg:flex flex-col gap-3 w-[260px] xl:w-[280px] shrink-0"
    >
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.035)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-400/65">
            Live Intelligence
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] text-white/25 font-medium">Real-time</span>
          </div>
        </div>

        <div className="px-4 py-3 space-y-3">
          {INTELLIGENCE_ROWS.map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-white/32">{row.label}</span>
                <span className="text-[10px] font-bold" style={{ color: row.color }}>
                  {row.value}
                </span>
              </div>
              <div
                className="h-[3px] rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${row.bar}%`,
                    background: `linear-gradient(90deg, ${row.color}cc, ${row.color}55)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl px-4 py-3"
        style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-400/65">
            Trade Network
          </span>
          <span className="text-[9px] text-white/25">6 hubs active</span>
        </div>

        <svg
          viewBox="0 0 220 90"
          className="w-full"
          aria-hidden="true"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {EDGES.map(([a, b], i) => {
            const na = NODES[a], nb = NODES[b];
            const mx = lerp(na.x, nb.x, 0.5);
            const my = Math.min(na.y, nb.y) - 12;
            return (
              <path
                key={i}
                d={`M ${na.x},${na.y} Q ${mx},${my} ${nb.x},${nb.y}`}
                stroke="url(#edge-grad)"
                strokeWidth="0.7"
                fill="none"
                strokeDasharray="2 3"
              />
            );
          })}

          {NODES.map((node) => (
            <g key={node.label}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size + 4}
                fill="url(#node-glow)"
                opacity="0.4"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill="#0d1f4a"
                stroke="#3b82f6"
                strokeWidth="1"
                strokeOpacity="0.7"
              />
              <circle cx={node.x} cy={node.y} r="1.5" fill="#60a5fa" />
              <text
                x={node.x}
                y={node.y + node.size + 7}
                textAnchor="middle"
                fontSize="5.5"
                fill="rgba(255,255,255,0.28)"
                fontFamily="monospace"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div
        className="rounded-xl px-4 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(37,99,235,0.08)',
          border: '1px solid rgba(59,130,246,0.15)',
        }}
      >
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-blue-400/65 mb-0.5">
            AI Model Status
          </p>
          <p className="text-xs font-semibold text-white/55">Blinkus Agent v2</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-blue-400"
                style={{
                  height: `${8 + i * 3}px`,
                  opacity: 0.3 + i * 0.14,
                }}
              />
            ))}
          </div>
          <span className="text-[9px] text-emerald-400/80 font-medium">Ready</span>
        </div>
      </div>
    </motion.div>
  );
}
