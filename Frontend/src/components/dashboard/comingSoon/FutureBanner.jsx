import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowRight } from 'lucide-react';

export default function FutureBanner({ onScrollToRoadmap }) {
  const navigate = useNavigate();

  const handleCta = () => {
    if (onScrollToRoadmap) {
      onScrollToRoadmap();
    } else {
      navigate('/dashboard/coming-soon');
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl mt-8 mb-2 border"
      style={{ borderColor: 'rgba(37,99,235,0.12)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, #f0f6ff 0%, #e8f0fe 40%, #eff6ff 70%, #f8faff 100%)',
        }}
      />

      <div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(59,130,246,0.04) 45%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-16 left-1/4 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              border: '1px solid rgba(37,99,235,0.15)',
            }}
          >
            <Rocket size={18} style={{ color: '#2563eb' }} />
          </div>
          <div>
            <h3
              className="font-bold text-base sm:text-lg leading-snug"
              style={{ color: '#0f172a' }}
            >
              Building the Future of Global Trade
            </h3>
            <p
              className="text-xs sm:text-sm mt-1.5 leading-relaxed max-w-lg"
              style={{ color: '#475569' }}
            >
              Blinkus is evolving into a complete trade operating system combining intelligence,
              credibility verification, contract drafting, logistics intelligence, compliance
              automation, and trade finance workflows.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCta}
          aria-label="View upcoming features"
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl active:scale-95 transition-all whitespace-nowrap hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
            boxShadow: '0 4px 16px rgba(37,99,235,0.25), 0 0 0 1px rgba(37,99,235,0.2)',
          }}
        >
          View Upcoming Features
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
