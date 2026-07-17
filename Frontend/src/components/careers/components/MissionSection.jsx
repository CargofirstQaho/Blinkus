import { motion } from 'motion/react';
import { Globe, TrendingUp, Users } from 'lucide-react';

const PILLARS = [
  {
    Icon: Globe,
    stat: '180+',
    label: 'Countries Covered',
    desc: 'Our trade intelligence reaches every major hub on the planet.',
  },
  {
    Icon: TrendingUp,
    stat: '$4.2B+',
    label: 'Trade Processed',
    desc: 'Real commerce value running through the Blinkus platform.',
  },
  {
    Icon: Users,
    stat: '1,200+',
    label: 'Trading Firms Served',
    desc: 'From first-time exporters to multinational conglomerates.',
  },
];

export default function MissionSection() {
  return (
    <section className="py-28 px-6 md:px-12 bg-black/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65 }}
          >
            <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">Our Mission</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-6 leading-tight">
              Making Global Trade<br />
              <span className="text-accent">Transparent &amp; Intelligent.</span>
            </h2>
            <p className="text-black/52 text-base leading-relaxed mb-5">
              Global trade moves $32 trillion every year — yet the systems powering it are fragmented,
              opaque, and decades behind. Blinkus is here to change that. Permanently.
            </p>
            <p className="text-black/52 text-base leading-relaxed mb-8">
              When you join Blinkus, you're not just taking a job. You're taking a seat at the table
              of an industry transformation that will define the next decade of global commerce.
            </p>
            <p className="text-base font-semibold text-black/70 border-l-2 border-accent pl-4 leading-relaxed">
              We are building the intelligence engine that the world's traders deserve — and we need
              exceptional people to help us get there.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="space-y-4"
          >
            {PILLARS.map(({ Icon, stat, label, desc }) => (
              <div
                key={label}
                className="flex items-start gap-5 p-6 rounded-2xl bg-white border border-black/5 hover:border-accent/20 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-accent leading-none mb-1">{stat}</div>
                  <div className="font-bold text-sm mb-0.5">{label}</div>
                  <div className="text-xs text-black/40 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
