import { motion } from 'motion/react';
import FooterCard from '../shared/FooterCard';
import { articles } from '../data/footerData';

export default function Articles() {
  return (
    <div className="pt-24">
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">Knowledge Hub</span>
          <h1 className="text-5xl md:text-6xl font-display font-bold mt-4 mb-6 leading-tight">
            Articles
          </h1>
          <p className="text-black/55 text-lg max-w-xl mx-auto leading-relaxed">
            Insights, research, and perspectives on AI, global trade, logistics, and supply chain
            innovation from the Blinkus team and the broader industry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <FooterCard
                image={article.image}
                title={article.title}
                description={article.excerpt}
                url={article.url}
                badge={article.source}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
