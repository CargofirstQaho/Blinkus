import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CareersHero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-accent/[0.07] blur-[160px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-accent/[0.05] blur-[120px] translate-y-1/3 -translate-x-1/4" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #6495ED 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-24 pt-36">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/25 bg-accent/[0.06] text-accent text-xs font-bold uppercase tracking-[0.2em] mb-10"
          >
            <Sparkles size={12} />
            We're Always Hiring
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-display font-bold leading-[0.93] tracking-tight mb-8"
          >
            Build the{' '}
            <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
              Intelligence Engine
            </span>
            <br />
            for Global Trade.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="text-lg sm:text-xl text-black/50 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            We are always looking for exceptional people who want to grow with us in building the
            intelligence engine for global trade. We don't fill roles — we find the right people
            and build around them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.44 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="mailto:orbit@blinkus.ai"
              className="btn-primary inline-flex items-center gap-2.5 px-9 py-4 text-base font-bold"
            >
              Send Resume <ArrowRight size={18} />
            </a>
            <a
              href="mailto:orbit@blinkus.ai"
              className="text-sm font-semibold text-black/35 hover:text-accent transition-colors duration-200 tracking-wide"
            >
              orbit@blinkus.ai
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
