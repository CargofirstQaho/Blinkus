import { motion } from 'motion/react';
import { Mail, Building2, Headphones, Handshake } from 'lucide-react';

const CONTACT_CARDS = [
  {
    Icon: Mail,
    label: 'General Inquiries',
    desc: 'Questions about the platform, pricing, or getting started?',
    action: 'orbit@blinkus.ai',
    href: 'mailto:orbit@blinkus.ai',
    cta: 'Send an Email',
  },
  {
    Icon: Handshake,
    label: 'Partnerships',
    desc: 'Interested in integrating Blinkus AI into your platform or forging a strategic alliance?',
    action: 'orbit@blinkus.ai',
    href: 'mailto:orbit@blinkus.ai',
    cta: 'Reach Out',
  },
  {
    Icon: Headphones,
    label: 'Support',
    desc: 'Existing customer needing help with your account, integrations, or data?',
    action: 'orbit@blinkus.ai',
    href: 'mailto:orbit@blinkus.ai',
    cta: 'Get Support',
  },
  {
    Icon: Building2,
    label: 'Enterprise Onboarding',
    desc: 'Looking for a custom deployment, dedicated account management, or volume pricing?',
    action: 'orbit@blinkus.ai',
    href: 'mailto:orbit@blinkus.ai',
    cta: 'Talk to Sales',
  },
];

export default function Contact() {
  return (
    <div className="pt-24">
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">Get in Touch</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold mt-4 mb-8 leading-tight">
            Let's Talk<br />
            <span className="text-accent italic">Trade.</span>
          </h1>
          <p className="text-xl text-black/60 max-w-2xl mx-auto leading-relaxed">
            For partnerships, support, enterprise onboarding, or any assistance, contact us at{' '}
            <a href="mailto:orbit@blinkus.ai" className="text-accent font-semibold hover:underline">
              orbit@blinkus.ai
            </a>
            . We respond to every inquiry within one business day.
          </p>
        </motion.div>
      </section>

      <section className="py-8 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CONTACT_CARDS.map(({ Icon, label, desc, action, href, cta }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card group hover:border-accent/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                <Icon size={22} />
              </div>
              <h3 className="font-bold text-lg mb-2">{label}</h3>
              <p className="text-black/55 text-sm leading-relaxed mb-5">{desc}</p>
              <a
                href={href}
                className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"
              >
                {cta} →
              </a>
              <div className="mt-1 text-xs text-black/40">{action}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-black/3">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-4">One Email. Every Need.</h2>
          <p className="text-black/55 text-base leading-relaxed mb-6">
            Whether you're an exporter exploring AI for the first time, a logistics platform looking
            to integrate Blinkus, or an enterprise needing a tailored deployment — we're here to help.
          </p>
          <a
            href="mailto:orbit@blinkus.ai"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold"
          >
            <Mail size={16} /> orbit@blinkus.ai
          </a>
        </div>
      </section>
    </div>
  );
}
