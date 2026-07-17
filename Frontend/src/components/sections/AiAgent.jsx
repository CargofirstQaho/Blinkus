import { MessageSquare, Send, Bot, Sparkles, Database, Search } from 'lucide-react';
import FeatureSection from '../common/FeatureSection.jsx';
import { motion } from 'motion/react';

export default function AiAgent() {
  return (
    <FeatureSection
      id="ai-agent"
      tagline="Autonomous Intelligence"
      title="Meet your Global Trade copilot."
      description="Blinkus AI Trade Agent is a sophisticated language model trained on millions of global trade records, customs regulations, and market trends. Ask anything from commodity pricing to HS code classifications."
      visual={
        <div className="relative w-full max-w-md">
          <div className="absolute -inset-4 bg-accent/10 blur-3xl rounded-full" />
          <motion.div
            whileHover={{ y: -5 }}
            className="relative glass-card border-accent/20 bg-white shadow-2xl p-0 overflow-hidden"
          >
            <div className="p-4 border-b border-black/5 flex items-center justify-between bg-accent/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold">Blinkus Intelligence</div>
                  <div className="text-[10px] text-accent flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Online • Real-time Data
                  </div>
                </div>
              </div>
              <Sparkles size={16} className="text-accent" />
            </div>

            <div className="p-6 space-y-4 h-[300px] overflow-y-auto bg-gray-50/50">
              <div className="flex justify-start">
                <div className="bg-white border border-black/5 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm">
                  Hello! I'm your trade intelligence assistant. How can I help you today?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-accent text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] text-sm shadow-md">
                  What's the average price of Coffee Arabica exports from Brazil to EU this week?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white border border-black/5 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm">
                  Based on recent customs data, Brazil's Coffee Arabica is averaging{' '}
                  <strong>$4,250/tonne</strong> CIF European ports. I see a 1.2% uptick due to
                  shipment delays in Santos.
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-black/5 bg-white flex gap-2">
              <div className="flex-1 bg-black/5 rounded-full px-4 py-2 text-sm text-black/40 flex items-center">
                Search exporters, prices, HS codes...
              </div>
              <button className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white">
                <Send size={18} />
              </button>
            </div>
          </motion.div>

          {/* Floating detail items */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-8 top-1/4 glass-card py-3 px-4 flex items-center gap-3 shadow-xl"
          >
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
              <Database size={16} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-black/40">CUSTOMS FEED</div>
              <div className="text-xs font-bold italic">LIVE UPDATES</div>
            </div>
          </motion.div>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4 mt-8">
        {[
          { label: 'Commodity Prices', icon: <Database size={16} /> },
          { label: 'HS Code Lookup',   icon: <Search size={16} /> },
          { label: 'Trade Regulations',icon: <Bot size={16} /> },
          { label: 'Market Sentiment', icon: <MessageSquare size={16} /> },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 p-3 rounded-xl border border-black/5 hover:border-accent/40 transition-colors group cursor-pointer"
          >
            <div className="text-accent group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </FeatureSection>
  );
}
