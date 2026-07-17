import { BarChart3, TrendingUp, Globe, ArrowUpRight, Zap } from 'lucide-react';
import FeatureSection from '../common/FeatureSection.jsx';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils.js';

export default function TradeAnalytics() {
  return (
    <FeatureSection
      id="trade-analytics"
      tagline="Comparative Analytics"
      title="Analyze Trade Benchmarks."
      description="Compare your export performance with global industry standards. Our AI engine processes bill of lading data and shipment trends to give you a competitive edge."
      reversed
      visual={
        <div className="w-full space-y-4">
          <div className="glass-card bg-white p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <Zap size={24} className="text-accent animate-pulse" />
            </div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-sm font-bold text-black/40 uppercase tracking-widest">
                  Market Comparison
                </h3>
                <div className="text-3xl font-display font-bold">Soybean Exports</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-display font-bold text-green-500 flex items-center gap-1">
                  <TrendingUp size={20} /> +12.4%
                </div>
                <div className="text-xs text-black/40 font-medium italic">VS GLOBAL AVERAGE</div>
              </div>
            </div>

            <div className="flex items-end gap-2 h-40">
              {[40, 65, 45, 90, 55, 80, 100, 70].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 1, ease: 'circOut' }}
                  className={cn(
                    'flex-1 rounded-t-lg transition-colors',
                    i === 6 ? 'bg-accent' : 'bg-black/10 group-hover:bg-black/20'
                  )}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-black/30">
              <span>JAN</span>
              <span>MAR</span>
              <span>MAY</span>
              <span>JUL</span>
              <span>SEP</span>
              <span>NOV</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card bg-accent text-white border-0">
              <div className="flex justify-between items-start mb-2">
                <Globe size={18} />
                <ArrowUpRight size={14} />
              </div>
              <div className="text-[10px] uppercase font-bold opacity-70">Top Buyer Region</div>
              <div className="text-lg font-display font-bold">South East Asia</div>
            </div>
            <div className="glass-card">
              <div className="flex justify-between items-start mb-2">
                <BarChart3 size={18} className="text-accent" />
              </div>
              <div className="text-[10px] uppercase font-bold text-black/40">Efficiency Score</div>
              <div className="text-lg font-display font-bold">98.2 / 100</div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <h4 className="font-bold text-lg">Market Trends</h4>
            <p className="text-black/60">
              Identify emerging buyer markets before your competitors do.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <BarChart3 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-lg">Benchmark Performance</h4>
            <p className="text-black/60">
              Real-time stats compared with 250+ global trading hubs.
            </p>
          </div>
        </div>
      </div>
    </FeatureSection>
  );
}
