import { motion } from 'motion/react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ComingSoon({ title = 'Coming Soon', description }) {
  return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl mx-auto"
      >
        <div className="w-20 h-20 rounded-3xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-8">
          <Sparkles size={36} />
        </div>
        <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">
          In the Works
        </span>
        <h1 className="text-5xl md:text-6xl font-display font-bold mt-4 mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-black/55 text-lg leading-relaxed mb-10">
          {description ||
            "We're crafting something exceptional. Stay tuned — the Blinkus team is working hard to bring you fresh trade intelligence, insights, and resources."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <a
            href="mailto:orbit@blinkus.ai"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold rounded-xl border border-black/10 hover:border-accent hover:text-accent transition-all duration-200"
          >
            Get Notified
          </a>
        </div>
      </motion.div>
    </div>
  );
}
