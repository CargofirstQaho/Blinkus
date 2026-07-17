import { motion } from 'motion/react';
import { ArrowRight, Mail } from 'lucide-react';

export default function CareersCTA() {
  return (
    <section className="relative py-28 px-6 md:px-12 bg-gradient-to-br from-slate-900 via-slate-900 to-[#0c1a3d] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-accent/[0.12] blur-[130px]" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-accent/[0.07] blur-[110px] translate-x-1/3 translate-y-1/3" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '38px 38px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.05] text-accent text-xs font-bold uppercase tracking-[0.2em] mb-10">
            <Mail size={12} /> Join the Journey
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-[0.95] tracking-tight mb-6">
            Ready to Build Something
            <br className="hidden sm:block" />{' '}
            <span className="bg-gradient-to-r from-accent to-blue-300 bg-clip-text text-transparent">
              That Lasts?
            </span>
          </h2>

          <p className="text-white/45 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12">
            We are always looking for exceptional people to grow with us on this journey. Send your
            resume and tell us what drives you. We read every single application — personally.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="mailto:orbit@blinkus.ai"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-accent text-white font-bold text-base hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Send Resume <ArrowRight size={18} />
            </a>
            <a
              href="mailto:orbit@blinkus.ai"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/15 text-white/60 text-sm font-semibold hover:border-white/30 hover:text-white transition-all duration-200"
            >
              <Mail size={15} /> orbit@blinkus.ai
            </a>
          </div>

          <p className="text-white/25 text-xs tracking-wide">
            No open positions? Doesn't matter. We hire the person, not the vacancy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
