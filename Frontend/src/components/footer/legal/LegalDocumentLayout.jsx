import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import LegalSectionBody from './LegalSectionBody';

export default function LegalDocumentLayout({ eyebrow, title, accentTitle, lastUpdated, sections, acknowledgment }) {
  return (
    <div className="pt-24">
      <section className="py-16 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">{eyebrow}</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold mt-4 mb-6 leading-tight">
            {title}<br />
            <span className="text-accent italic">{accentTitle}</span>
          </h1>
          <p className="text-xs font-bold text-black/40 uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 max-w-6xl mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
          {/* Mobile / tablet table of contents */}
          <details className="glass-card lg:hidden group">
            <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-sm uppercase tracking-widest">
              On This Page
              <ChevronDown size={18} className="text-accent transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <nav className="mt-4 space-y-3 text-sm">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-black/60 hover:text-accent transition-colors duration-200"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </details>

          {/* Desktop sidebar table of contents */}
          <aside className="hidden lg:block">
            <div className="glass-card lg:sticky lg:top-28">
              <h2 className="font-bold text-sm uppercase tracking-widest mb-4">On This Page</h2>
              <nav className="space-y-3 text-sm max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-black/60 hover:text-accent transition-colors duration-200"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Document content */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
                className="scroll-mt-28 pb-10 border-b border-black/5 last:border-b-0 last:pb-0"
              >
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">{section.title}</h2>
                <LegalSectionBody section={section} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-black/3">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-black/70 text-base md:text-lg leading-relaxed font-medium italic">
            {acknowledgment}
          </p>
        </div>
      </section>
    </div>
  );
}
