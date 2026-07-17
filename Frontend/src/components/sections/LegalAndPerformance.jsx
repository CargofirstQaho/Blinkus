import {
  FileText,
  ClipboardCheck,
  LayoutDashboard,
  Rocket,
  FileSignature,
  CheckCircle,
} from 'lucide-react';
import FeatureSection from '../common/FeatureSection.jsx';

export default function LegalAndPerformance() {
  return (
    <div className="space-y-0">
      <FeatureSection
        tagline="Legal Intelligence"
        title="AI-Powered Trade Legal Hub."
        description="Draft bulletproof international sales contracts in seconds. Our AI understands Incoterms 2020, CISG, and local regional trade laws to protect your shipments."
        visual={
          <div className="relative glass-card bg-white p-8 max-w-sm ml-auto border-black/5 shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FileText size={120} />
            </div>
            <div className="flex items-center gap-2 mb-6 text-accent">
              <FileSignature size={24} />
              <span className="font-bold tracking-widest text-xs uppercase">Contract Blueprint</span>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-3/4 bg-black/5 rounded-full" />
              <div className="h-4 w-full bg-black/5 rounded-full" />
              <div className="h-4 w-5/6 bg-black/5 rounded-full" />
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
                <div className="text-[10px] font-bold text-accent mb-1 uppercase">
                  Recommended Clause
                </div>
                <p className="text-xs italic text-black/60 font-medium">
                  "Include Arbitration clause for Singapore jurisdiction based on current LC
                  requirements."
                </p>
              </div>
              <div className="h-4 w-2/3 bg-black/5 rounded-full" />
            </div>
            <button className="w-full mt-8 py-3 bg-black text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 group">
              Generate PDF{' '}
              <Rocket
                size={16}
                className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Incoterms Automation', icon: <ClipboardCheck size={20} /> },
            { title: 'Multi-lingual Drafting', icon: <FileText size={20} /> },
          ].map((item) => (
            <div
              key={item.title}
              className="p-4 border border-black/5 rounded-2xl flex items-center gap-3"
            >
              <div className="text-accent">{item.icon}</div>
              <span className="text-sm font-bold">{item.title}</span>
            </div>
          ))}
        </div>
      </FeatureSection>

      <FeatureSection
        tagline="Trade Lifecycle"
        reversed
        title="Performance Dashboards."
        description="Monitor every KPI that matters. From shipment turnaround times to supplier reliability metrics, get a bird's-eye view of your global trade desk."
        visual={
          <div className="glass-card bg-black text-white p-8 w-full max-w-md relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 blur-[100px] rounded-full" />
            <div className="flex items-center gap-3 mb-8">
              <LayoutDashboard size={20} className="text-accent" />
              <h3 className="font-display font-bold">EXECUTIVE VIEW</h3>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-[10px] uppercase font-bold text-white/40 mb-1">
                  Total Trade Volume
                </div>
                <div className="text-3xl font-display font-bold">$4.2M</div>
                <div className="text-[10px] text-green-400 font-bold">↑ 8.2% YTD</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-white/40 mb-1">
                  Active Shipments
                </div>
                <div className="text-3xl font-display font-bold">248</div>
                <div className="text-[10px] text-accent font-bold">12 IN TRANSIT</div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Carrier Reliability',      val: '94%' },
                { label: 'Avg Customs Clearance',    val: '1.4 Days' },
                { label: 'Cost Avoidance',           val: '$124,500' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-2 border-b border-white/10 text-sm"
                >
                  <span className="text-white/60">{item.label}</span>
                  <span className="font-bold">{item.val}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-accent">
              <CheckCircle size={14} /> ALL SYSTEMS OPERATIONAL
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-black/60 italic font-medium">
            "System detected a 3% variance in freight costs across the West Africa corridor.
            Re-routing recommended."
          </p>
          <button className="btn-primary">Explore Analytics</button>
        </div>
      </FeatureSection>
    </div>
  );
}
