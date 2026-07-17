import { Rocket } from 'lucide-react';

export default function ComingSoonHero() {
  return (
    <div
      className="relative mb-8 rounded-2xl overflow-hidden px-6 py-10 sm:px-10 sm:py-14"
      style={{
        background: 'linear-gradient(135deg, #f0f6ff 0%, #e8f0fe 40%, #eff6ff 70%, #f8faff 100%)',
        border: '1px solid rgba(37,99,235,0.12)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 70% 40%, rgba(37,99,235,0.08) 0%, transparent 70%)',
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

      <div className="relative z-10 max-w-2xl">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5"
          style={{
            background: 'rgba(37,99,235,0.07)',
            border: '1px solid rgba(37,99,235,0.18)',
          }}
        >
          <Rocket size={13} style={{ color: '#2563eb' }} />
          <span
            className="text-[11px] font-semibold tracking-wide uppercase"
            style={{ color: '#1d4ed8' }}
          >
            Blinkus Roadmap
          </span>
        </div>

        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight"
          style={{
            background: 'linear-gradient(140deg, #0f172a 0%, #1e40af 45%, #2563eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Upcoming Trade Intelligence Modules
        </h1>

        <p className="text-sm sm:text-base leading-relaxed max-w-xl" style={{ color: '#475569' }}>
          Explore the next generation of AI-powered trade tools currently being built for global
          importers, exporters, sourcing teams, logistics providers, and trade finance professionals.
        </p>
      </div>
    </div>
  );
}
