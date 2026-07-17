import { cn } from '../../lib/utils';

const RING = {
  sm: { wrap: 'w-4 h-4',    bw: '1.5px' },
  md: { wrap: 'w-8 h-8',    bw: '2px'   },
  lg: { wrap: 'w-12 h-12',  bw: '2.5px' },
};

function SpinnerRing({ size = 'md', hidden = false }) {
  const { wrap, bw } = RING[size];

  return (
    <div
      className={cn('relative shrink-0', wrap)}
      role={hidden ? undefined : 'status'}
      aria-label={hidden ? undefined : 'Loading'}
      aria-hidden={hidden || undefined}
    >
      {!hidden && <span className="sr-only">Loading</span>}

      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{ border: `${bw} solid rgba(100, 149, 237, 0.12)` }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          background:
            'conic-gradient(from 0deg at 50% 50%, transparent 0%, transparent 55%, #6495ED 100%)',
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${bw}), black calc(100% - ${bw}))`,
          mask:       `radial-gradient(farthest-side, transparent calc(100% - ${bw}), black calc(100% - ${bw}))`,
          animationDuration:       '1s',
          animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
        }}
      />
    </div>
  );
}

export default function Spinner({ fullScreen = false, size = 'md' }) {
  if (!fullScreen) return <SpinnerRing size={size} />;

  return (
    <>
      <style>{`
        @keyframes blinkus-shimmer {
          0%   { transform: translateX(-220%); }
          100% { transform: translateX(220%); }
        }
        @keyframes blinkus-card-in {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Loading"
      >
        <div
          className="flex flex-col items-center gap-5 rounded-2xl bg-white/80 backdrop-blur-md px-10 py-9 border border-black/5"
          style={{
            animation:  'blinkus-card-in 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            boxShadow:  '0 8px 40px rgba(0, 0, 0, 0.07), 0 2px 10px rgba(0, 0, 0, 0.04)',
          }}
        >
          <SpinnerRing size="lg" hidden />

          <div className="flex flex-col items-center gap-1.5 text-center">
            <p
              className="text-sm font-display font-bold tracking-tight"
              style={{ color: '#0f172a' }}
            >
              Blinkus
            </p>
            <p
              className="text-[11px] font-medium"
              style={{ color: '#94a3b8' }}
            >
              Preparing your workspace...
            </p>
          </div>

          <div
            aria-hidden="true"
            className="relative overflow-hidden rounded-full"
            style={{ width: '88px', height: '2px', background: 'rgba(100, 149, 237, 0.1)' }}
          >
            <div
              className="absolute inset-y-0 left-0 h-full rounded-full"
              style={{
                width:      '38%',
                background: 'linear-gradient(to right, transparent, rgba(100, 149, 237, 0.55), transparent)',
                animation:  'blinkus-shimmer 1.8s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
