import { motion } from 'motion/react';

const TALENT_TAGS = [
  'AI & ML Engineers',
  'Backend Engineers',
  'Frontend Engineers',
  'Trade Domain Experts',
  'Product Managers',
  'UX / Product Designers',
  'Data Scientists',
  'Supply Chain Analysts',
  'Growth Operators',
  'Business Development',
  'Logistics Specialists',
  'Compliance Experts',
  'DevOps Engineers',
  'Sales Engineers',
  'Technical Writers',
  'Quantitative Analysts',
];

export default function TalentSection() {
  return (
    <section className="py-28 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">Who We Look For</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-5 leading-tight">
            Exceptional People.<br className="hidden sm:block" /> Full Stop.
          </h2>
          <p className="text-black/48 text-base max-w-xl mx-auto leading-relaxed">
            We don't wait for an open position to find the right person. If you're exceptional at what
            you do and genuinely excited about the future of global trade — we want to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {TALENT_TAGS.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: i * 0.035 }}
              className="px-4 py-2 rounded-full border border-black/8 bg-white text-sm font-medium text-black/55 hover:border-accent/40 hover:text-accent hover:bg-accent/[0.04] transition-all duration-200 cursor-default select-none"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-br from-accent/[0.08] via-accent/[0.04] to-transparent border border-accent/15 p-8 md:p-14 text-center overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-accent/[0.08] blur-[90px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-accent/[0.06] blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
          <p className="relative z-10 text-xl md:text-2xl font-display font-semibold text-black/75 leading-relaxed max-w-2xl mx-auto">
            "The best teams are built on curiosity, ownership, and a shared obsession with making
            something genuinely hard look effortless."
          </p>
          <p className="relative z-10 mt-6 text-xs font-bold text-accent uppercase tracking-[0.2em]">
            Blinkus Core Belief
          </p>
        </motion.div>
      </div>
    </section>
  );
}
