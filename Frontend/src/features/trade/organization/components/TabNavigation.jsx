import { Crown } from 'lucide-react';

export default function TabNavigation({ tabs, activeTab, onChange }) {
  return (
    <div 
      className="sticky top-0 z-10 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 py-2.5 mb-5 sm:mb-6 backdrop-blur"
      style={{ background: 'rgba(248,250,252,0.85)', borderBottom: '1px solid #e2e8f0' }}
    >
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              disabled={tab.disabled}
              title={tab.disabled ? tab.disabledHint : undefined}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 disabled:cursor-not-allowed"
              style={
                isActive
                  ? { color: '#ffffff', background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', boxShadow: '0 4px 14px rgba(37,99,235,0.28)' }
                  : tab.disabled
                  ? { color: '#cbd5e1', background: '#f8fafc', border: '1px solid #e2e8f0' }
                  : { color: '#64748b', background: '#ffffff', border: '1px solid #e2e8f0' }
              }
            >
              {tab.disabled ? <Crown size={14} /> : Icon && <Icon size={16} />}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
