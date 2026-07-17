import { MapPin, Truck, Newspaper, Radio, Search, Anchor, Zap } from 'lucide-react';
import FeatureSection from '../common/FeatureSection.jsx';
import { motion } from 'motion/react';

export default function Operations() {
  return (
    <div className="bg-white">
      <FeatureSection
        tagline="Physical Verification"
        title="On-field Company Audit."
        description="Verify entities beyond the screen. Our network of field agents provides physical company audits, photos, and live site inspections anywhere in the world."
        visual={
          <div className="relative w-full max-w-sm bg-black/5 rounded-[2rem] p-4">
            <div className="bg-white rounded-[1.5rem] p-6 shadow-xl border border-black/5">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Site Verification</h4>
                    <p className="text-[10px] text-black/40 font-bold">ORDER ID: #VX-7892</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold">
                  COMPLETED
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-black/20 font-bold italic">
                  Warehouse Exterior
                </div>
                <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-black/20 font-bold italic">
                  Loading Bay 04
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2 text-xs font-medium">
                  <div className="text-green-500 font-bold">✓</div>
                  <span className="text-black/60">Registered address verified physically</span>
                </div>
                <div className="flex gap-2 text-xs font-medium">
                  <div className="text-green-500 font-bold">✓</div>
                  <span className="text-black/60">Stock inventory audit confirmed</span>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-4 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-accent border border-black/5">
              <Radio size={24} className="animate-pulse" />
            </div>
          </div>
        }
      >
        <button className="px-6 py-3 border border-black/20 rounded-full font-bold text-sm hover:bg-black/5 transition-colors">
          Request Field Audit
        </button>
      </FeatureSection>

      <FeatureSection
        tagline="Real-time Tracking"
        reversed
        title="Global BL Tracking Hub."
        description="Track your Bill of Lading across 150+ shipping lines and ports. Integrated AIS satellite tracking for hyper-accurate ETA predictions."
        visual={
          <div className="w-full space-y-4">
            <div className="glass-card bg-white p-6 relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                  <Anchor size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Shipment MAEU98721</h4>
                  <p className="text-xs text-black/40">Vessel: MAERSK HALIFAX</p>
                </div>
              </div>

              <div className="relative py-8">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black/5 -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-3/4 h-[2px] bg-accent -translate-y-1/2" />
                <div className="flex justify-between items-center relative z-10">
                  <div className="w-4 h-4 rounded-full bg-accent border-4 border-white" />
                  <div className="w-4 h-4 rounded-full bg-accent border-4 border-white" />
                  <div className="w-8 h-8 rounded-full bg-accent border-4 border-white flex items-center justify-center text-white">
                    <Truck size={14} />
                  </div>
                  <div className="w-4 h-4 rounded-full bg-black/10 border-4 border-white" />
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-bold text-black/40 uppercase tracking-widest mt-2">
                <span>SANTOS (BR)</span>
                <span>ROTTERDAM (NL)</span>
              </div>

              <div className="mt-8 flex items-center justify-between p-4 bg-accent/5 rounded-2xl border border-accent/10">
                <div className="text-xs font-bold">Estimated Arrival</div>
                <div className="text-lg font-display font-black text-accent uppercase">
                  MAY 24, 08:00 AM
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div className="flex items-center gap-2 bg-black/5 rounded-full p-2 pr-4 w-fit">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-accent shadow-sm">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Enter BL Number..."
            className="bg-transparent border-none outline-none text-sm font-medium px-2"
          />
        </div>
      </FeatureSection>

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">
              Market Intel
            </span>
            <h2 className="text-4xl font-display font-bold">Live Market News.</h2>
          </div>
          <button className="text-sm font-bold flex items-center gap-2 hover:text-accent transition-colors">
            VIEW FEED <Zap size={16} fill="currentColor" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'New EU Carbon Border Tax update: What traders need to know',
              category: 'REGULATIONS',
            },
            {
              title: 'Freight rates on Asia-West Coast route drop by 12% this week',
              category: 'LOGISTICS',
            },
            {
              title: 'Brazil Soybean harvest forecast increased; prices expected to stabilize',
              category: 'COMMODITIES',
            },
          ].map((news, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="glass-card hover:border-accent/40 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] font-black text-accent mb-4 tracking-widest">
                  {news.category}
                </div>
                <h4 className="text-lg font-bold leading-tight mb-6">{news.title}</h4>
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-black/40">
                <span>2 HOURS AGO</span>
                <Newspaper size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
