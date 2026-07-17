import { motion } from 'motion/react';
import { ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square bg-accent/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto glass-card bg-black text-white p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden border-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-7xl font-display font-bold mb-8 leading-tight">
            Ready to scale your <br />{' '}
            <span className="text-accent ">global footprint?</span>
          </h2>
          <p className="text-xl text-white/60 mb-12 max-w-xl mx-auto">
            Join 1,200+ global trading firms using Blinkus to automate their intelligence and risk
            operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary py-3 px-5 text-lg w-full sm:w-auto text-center">
              Request Pilot Access
            </Link>
            <Link
              to="/contact"
              className="px-10 py-5 rounded-full border border-white/20 font-bold  transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Talk to Sales <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
