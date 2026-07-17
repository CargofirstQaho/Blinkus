import { motion } from 'motion/react';
import { Globe, Zap, Shield, TrendingUp, Target, Users } from 'lucide-react';

const VALUES = [
  { Icon: Globe,      label: 'Global First',        desc: 'Built for traders, exporters, and logistics teams operating across borders, time zones, and regulatory frameworks.' },
  { Icon: Zap,        label: 'AI at the Core',       desc: 'Every feature is powered by purpose-trained models that understand global trade, not just general language.' },
  { Icon: TrendingUp, label: 'Data Integrity',       desc: 'Our AI is trained on verified customs, bill of lading, and market data — no synthetic noise, no hallucinations.' },
  { Icon: Shield,     label: 'Trust by Design',      desc: 'Security, compliance, and data sovereignty are built into every layer of the Blinkus platform.' },
  { Icon: Target,     label: 'Trader-Centric',       desc: 'Every decision, every feature, and every release is shaped by feedback from real global trading desks.' },
  { Icon: Users,      label: 'Community Driven',     desc: 'We grow alongside the trade community — building partnerships with exporters, freight forwarders, and customs agents.' },
];

const STATS = [
  ['2022',   'Founded'],
  ['1,200+', 'Trading Firms'],
  ['$4.2B',  'Trade Processed'],
  ['40+',    'Countries Served'],
];

export default function AboutUs() {
  return (
    <div className="pt-24">
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold mt-4 mb-8 leading-tight">
            Built for the<br />
            <span className="text-accent italic">Modern Trader.</span>
          </h1>
          <p className="text-xl text-black/60 max-w-2xl mx-auto leading-relaxed">
            Blinkus AI was founded by a team of global trade veterans and AI engineers who were tired of
            fragmented, outdated tools slowing down the world's most complex industry. We set out to build
            the intelligence layer that global trade deserved.
          </p>
        </motion.div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-black/3">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(([val, label]) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-4xl font-display font-bold text-accent">{val}</div>
              <div className="text-sm text-black/50 mt-2 uppercase tracking-widest font-bold">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-display font-bold">What We Stand For</h2>
          <p className="text-black/50 mt-4 max-w-xl mx-auto text-base">
            Our values shape every product decision, every partnership, and every line of code at Blinkus.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map(({ Icon, label, desc }) => (
            <div key={label} className="glass-card flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Icon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">{label}</h3>
                <p className="text-black/55 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-black/3">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">The Mission</span>
            <h2 className="text-4xl font-display font-bold mt-3 mb-6 leading-tight">
              Advancing Global Trade Through Autonomous Intelligence
            </h2>
            <p className="text-black/60 text-base leading-relaxed mb-4">
              We believe global trade should be transparent, efficient, and accessible to every business —
              regardless of size or location. Blinkus AI brings autonomous intelligence to every step of the
              trade journey: from market discovery and risk assessment to compliance and shipment tracking.
            </p>
            <p className="text-black/60 text-base leading-relaxed">
              Our platform integrates real-time data from customs authorities, shipping lines, financial
              institutions, and market indices to give traders a unified, AI-powered view of the global
              trade landscape.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Real-time Intelligence',  desc: 'Live market data across 180+ countries' },
              { label: 'AI Risk Engine',           desc: 'Predictive risk scoring for every shipment' },
              { label: 'Compliance Automation',   desc: 'HS codes, regulatory checks, docs auto-fill' },
              { label: 'Trade Connectivity',       desc: 'Connect buyers, sellers, and logistics in one platform' },
            ].map(({ label, desc }) => (
              <div key={label} className="glass-card p-4">
                <div className="font-bold text-sm mb-1">{label}</div>
                <div className="text-xs text-black/50 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
