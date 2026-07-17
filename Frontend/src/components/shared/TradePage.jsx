import { motion } from 'motion/react';
import { Clock, Zap, ArrowRight } from 'lucide-react';

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div
      className="rounded-2xl bg-white p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow"
      style={{ border: '1px solid #e2e8f0' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(37,99,235,0.08)' }}
      >
        <Icon size={18} style={{ color: '#2563eb' }} />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#0f172a' }}>{title}</h3>
        <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{description}</p>
      </div>
    </div>
  );
}

function WorkflowCard({ icon: Icon, step, title, description, isLast }) {
  return (
    <div className="relative flex flex-col items-center text-center gap-2.5 px-2">
      <div className="relative flex items-center justify-center w-full">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative z-10"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
            boxShadow: '0 4px 14px rgba(37,99,235,0.28)',
          }}
        >
          {Icon
            ? <Icon size={16} color="white" />
            : <span className="text-xs font-bold text-white">{step}</span>}
        </div>
        {!isLast && (
          <ArrowRight
            size={14}
            className="hidden lg:block absolute left-[calc(50%+20px)] top-1/2 -translate-y-1/2"
            style={{ color: '#cbd5e1' }}
          />
        )}
      </div>
      <div>
        <p className="text-xs font-semibold" style={{ color: '#0f172a' }}>{title}</p>
        <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: '#94a3b8' }}>{description}</p>
      </div>
    </div>
  );
}

function AutomationItem({ title, description }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span
        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: '#60a5fa' }}
      />
      <div>
        <p className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{title}</p>
        {description && (
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'rgba(226,232,240,0.55)' }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function TradePage({
  title,
  description,
  icon: Icon,
  badge = 'Coming Soon',
  features = [],
  workflow = [],
  automation = [],
}) {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-5 sm:space-y-6"
      >
        <div
          className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 55%, #fafeff 100%)',
            border: '1px solid rgba(37,99,235,0.12)',
          }}
        >
          <div
            className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)' }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                'linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
              }}
            >
              <Icon size={26} color="white" />
            </div>

            <div className="flex-1 min-w-0">
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full mb-2.5"
                style={{
                  background: 'rgba(37,99,235,0.09)',
                  color: '#1d4ed8',
                  border: '1px solid rgba(37,99,235,0.15)',
                }}
              >
                <Clock size={10} />
                {badge}
              </span>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-display font-bold leading-tight"
                style={{ color: '#0f172a' }}
              >
                {title}
              </h1>
              <p
                className="text-sm sm:text-base mt-2 max-w-2xl leading-relaxed"
                style={{ color: '#64748b' }}
              >
                {description}
              </p>
            </div>
          </div>
        </div>

        {features.length > 0 && (
          <section aria-label="Key Features">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-3"
              style={{ color: '#94a3b8' }}
            >
              Key Features
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {features.map((f, i) => (
                <FeatureCard key={i} {...f} />
              ))}
            </div>
          </section>
        )}

        {workflow.length > 0 && (
          <section
            className="rounded-2xl bg-white p-5 sm:p-6"
            style={{ border: '1px solid #e2e8f0' }}
            aria-label="Workflow Preview"
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-5"
              style={{ color: '#94a3b8' }}
            >
              Workflow Preview
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {workflow.map((step, i) => (
                <WorkflowCard
                  key={i}
                  {...step}
                  step={i + 1}
                  isLast={i === workflow.length - 1}
                />
              ))}
            </div>
          </section>
        )}

        {automation.length > 0 && (
          <section
            className="rounded-2xl p-5 sm:p-6"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)' }}
            aria-label="Future Automation"
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap size={15} style={{ color: '#93c5fd' }} />
              <p className="text-sm font-bold" style={{ color: '#e0f2fe' }}>Future Automation</p>
            </div>
            <p className="text-xs mb-4" style={{ color: 'rgba(224,242,254,0.55)' }}>
              These features will be available when the module launches.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y divide-white/5">
              {automation.map((item, i) => (
                <AutomationItem key={i} {...item} />
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </div>
  );
}
