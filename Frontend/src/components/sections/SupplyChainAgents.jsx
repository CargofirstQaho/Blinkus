import { Calculator, ShieldAlert, CreditCard, PieChart, ArrowRight } from 'lucide-react';
import FeatureSection from '../common/FeatureSection.jsx';
import { motion } from 'motion/react';

export default function SupplyChainAgents() {
  return (
    <div className="bg-black/5 py-12 rounded-[3rem] my-24 mx-4 md:mx-12">
      <FeatureSection
        tagline="Optimization"
        reversed
        title="Automated Cost & Risk Agents."
        description="Optimize every dollar from factory floor to final destination. Our specialized agents handle cost breakdowns, insurance procurement, and complex risk assessments."
        visual={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <motion.div
              whileHover={{ y: -10 }}
              className="glass-card bg-white p-6 shadow-xl border-accent/10"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center mb-6">
                <Calculator size={24} />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Cost Optimization</h3>
              <p className="text-sm text-black/60 mb-6">
                AI generated cost sheets with 99.8% freight accuracy.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Duty & Taxes</span>
                  <span className="font-bold">$2,340</span>
                </div>
                <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                  <div className="w-[70%] h-full bg-accent" />
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span>Logistics</span>
                  <span className="font-bold">$4,890</span>
                </div>
                <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                  <div className="w-[45%] h-full bg-accent opacity-60" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="glass-card bg-white p-6 shadow-xl translate-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-400 text-white flex items-center justify-center mb-6">
                <ShieldAlert size={24} />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Risk Assessment</h3>
              <p className="text-sm text-black/60 mb-6">
                Geopolitical and route-specific risk monitoring.
              </p>
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                STRIKE ALERT: PORT OF HAMBURG
              </div>
            </motion.div>

            <div className="md:col-span-2 glass-card bg-white flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold">Trade Finance</div>
                  <div className="text-[10px] text-black/40">LC Issuance available</div>
                </div>
              </div>
              <button className="text-accent font-bold text-xs flex items-center gap-1 group">
                Apply Now{' '}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="bg-white/50 p-4 rounded-2xl border border-black/5">
            <div className="flex items-center gap-2 mb-2 text-accent">
              <PieChart size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Intelligence Report</span>
            </div>
            <p className="text-sm font-medium italic">
              "Switching to Port Kelang for December shipments could reduce costs by 15.2% based on
              current freight indexes."
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border border-black/5 rounded-2xl">
              <div className="text-2xl font-display font-bold text-accent">25%</div>
              <div className="text-[10px] font-bold text-black/40 uppercase">Avg cost saving</div>
            </div>
            <div className="text-center p-4 border border-black/5 rounded-2xl">
              <div className="text-2xl font-display font-bold text-accent">100+</div>
              <div className="text-[10px] font-bold text-black/40 uppercase">Insurers</div>
            </div>
          </div>
        </div>
      </FeatureSection>
    </div>
  );
}
