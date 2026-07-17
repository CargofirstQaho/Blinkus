import { motion } from 'motion/react';
import { Crown, Globe, Heart, Rocket, Target, Zap } from 'lucide-react';

const REASONS = [
  {
    Icon: Crown,
    title: 'High Ownership',
    desc: 'No bureaucracy. No hand-holding. You own real problems, real products, and real outcomes that ship to the world.',
  },
  {
    Icon: Globe,
    title: 'Global Scale Impact',
    desc: 'What you build reaches exporters, freight operators, and supply chains across 40+ countries. Your work changes how the world trades.',
  },
  {
    Icon: Heart,
    title: 'People-First Culture',
    desc: "We invest in long-term relationships with every person who joins us. When you grow, Blinkus grows. That's not a tagline — it's how we operate.",
  },
  {
    Icon: Rocket,
    title: 'Move Fast, Build Big',
    desc: 'We move at startup velocity with enterprise conviction. You will ship things in weeks that other companies spend years trying to build.',
  },
  {
    Icon: Target,
    title: 'Mission-Driven Work',
    desc: "Every decision ties back to a mission that matters. We're making global trade transparent, intelligent, and accessible for everyone.",
  },
  {
    Icon: Zap,
    title: 'Frontier Technology',
    desc: "Work with the latest in AI, autonomous agents, real-time data pipelines, and trade intelligence systems at the edge of what's possible.",
  },
];

export default function WhyJoinBlinkus() {
  return (
    <section className="py-28 px-6 md:px-12 bg-black/[0.02]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">Why Blinkus</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-5 leading-tight">
            Built Different.<br className="hidden sm:block" /> For a Reason.
          </h2>
          <p className="text-black/48 text-base max-w-lg mx-auto leading-relaxed">
            Blinkus isn't just another tech startup. We're building the intelligence layer for one of
            the world's oldest and most complex industries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="glass-card group hover:border-accent/25 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                <Icon size={22} />
              </div>
              <h3 className="font-bold text-[15px] mb-2">{title}</h3>
              <p className="text-black/50 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
