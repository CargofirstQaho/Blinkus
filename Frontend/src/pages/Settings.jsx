import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Shield, Palette, Globe, ChevronRight, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { cn } from '../lib/utils';

const SECTIONS = [
  {
    icon: Bell, label: 'Notifications',
    items: [
      { key: 'emailAlerts',  label: 'Email Alerts',         desc: 'Get notified via email for risk events' },
      { key: 'pushAlerts',   label: 'Push Notifications',   desc: 'Browser push for live market updates'   },
      { key: 'weeklyDigest', label: 'Weekly Digest',        desc: 'Summary of your trade desk activity'    },
    ],
  },
  {
    icon: Shield, label: 'Security',
    items: [
      { key: 'twoFactor',  label: 'Two-Factor Auth',   desc: 'Add extra protection to your account' },
      { key: 'sessionLogs', label: 'Session Logs',     desc: 'View login activity history'           },
    ],
  },
];

const AI_MODELS = [
  { id: 'gemini-2.5-flash',   label: 'Gemini 2.0 Flash',   desc: 'Fast, efficient responses'   },
  { id: 'gemini-1.5-pro',     label: 'Gemini 1.5 Pro',     desc: 'Advanced reasoning & analysis' },
  { id: 'gemini-1.5-flash',   label: 'Gemini 1.5 Flash',   desc: 'Balanced speed and quality'   },
];

export default function Settings() {
  const [toggles, setToggles] = useState({
    emailAlerts: true, pushAlerts: false, weeklyDigest: true, twoFactor: false, sessionLogs: true,
  });
  const [model, setModel] = useState('BLINKUS TRADE AGENT 1.0');

  const toggle = (key) => {
    setToggles((p) => ({ ...p, [key]: !p[key] }));
    toast.success('Setting updated');
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold mb-1">Settings</h1>
        <p className="text-black/50 text-sm mb-8">Configure your Blinkus experience</p>

        {/* <div className="bg-white rounded-2xl border border-black/5 p-6 mb-5">
          <div className="flex items-center gap-2 mb-5">
            <Globe size={18} className="text-accent" />
            <h2 className="font-bold">AI Model</h2>
          </div>
          <div className="space-y-2"> 
            {AI_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => { setModel(m.id); toast.success(`Switched to ${m.label}`); }}
                className={cn(
                  'w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left',
                  model === m.id ? 'border-accent/30 bg-accent/5' : 'border-black/8 hover:border-black/20'
                )}
              >
                <div>
                  <div className="text-sm font-bold">{m.label}</div>
                  <div className="text-xs text-black/40">{m.desc}</div>
                </div>
                {model === m.id && <Check size={16} className="text-accent shrink-0" />}
              </button>
            ))}
          </div>
        </div> */}

        {SECTIONS.map(({ icon: Icon, label, items }) => (
          <div key={label} className="bg-white rounded-2xl border border-black/5 p-6 mb-5">
            <div className="flex items-center gap-2 mb-5">
              <Icon size={18} className="text-accent" />
              <h2 className="font-bold">{label}</h2>
            </div>
            <div className="space-y-4">
              {items.map(({ key, label: itemLabel, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{itemLabel}</div>
                    <div className="text-xs text-black/40">{desc}</div>
                  </div>
                  <button
                    onClick={() => toggle(key)}
                    className={cn(
                      'w-11 h-6 rounded-full transition-all relative',
                      toggles[key] ? 'bg-accent' : 'bg-black/10'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-all',
                      toggles[key] ? 'left-6' : 'left-1'
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
          <h2 className="font-bold text-red-600 mb-1">Danger Zone</h2>
          <p className="text-sm text-red-400 mb-4">These actions are permanent and cannot be undone.</p>
          <button
            onClick={() => toast.error('Contact support to delete your account')}
            className="px-4 py-2 border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
