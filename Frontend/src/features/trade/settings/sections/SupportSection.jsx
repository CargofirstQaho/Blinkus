import { useState } from 'react';
import { HelpCircle, Mail, Copy, Check, ExternalLink, Clock, MessageCircle } from 'lucide-react';
import SettingsSectionWrapper from '../components/SettingsSectionWrapper';
import { SUPPORT_EMAIL } from '../utils/constants';

const SUPPORT_HOURS = [
  { day: 'Monday – Saturday', hours: '9:00 AM – 10:00 PM IST' },
];

export default function SupportSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <SettingsSectionWrapper
      title="Support"
      description="Get help with billing, technical issues, or any other enquiries."
    >
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}>
        <div
          className="px-6 py-8 text-center"
          style={{ background: 'linear-gradient(135deg, #f0f6ff 0%, #e8f0fe 55%, #eff6ff 100%)', borderBottom: '1px solid rgba(37,99,235,0.08)' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', boxShadow: '0 6px 20px rgba(37,99,235,0.28)' }}>
            <HelpCircle size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-display font-bold mb-2" style={{ color: '#0f172a' }}>Need Help?</h3>
          <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: '#64748b' }}>
            For issues, billing enquiries, technical support, feedback, or partnership discussions, reach out to our team.
          </p>
        </div>
        <div className="px-6 py-6">
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl mb-4"
            style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)' }}>
                <Mail size={18} style={{ color: '#2563eb' }} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#94a3b8' }}>Support Email</p>
                <p className="text-sm font-semibold" style={{ color: '#1e40af' }}>{SUPPORT_EMAIL}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={
                  copied
                    ? { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }
                    : { background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', color: '#1d4ed8' }
                }
              >
                {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
              </button>
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Support%20Request%20-%20Blinkus`}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', color: '#ffffff' }}
              >
                <ExternalLink size={13} /> Send Email
              </a>
            </div>
          </div>

          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(37,99,235,0.03)', border: '1px solid rgba(37,99,235,0.08)' }}
          >
            <MessageCircle size={15} className="shrink-0 mt-0.5" style={{ color: '#2563eb' }} />
            <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>
              When contacting support, please include your registered email address and a clear description of your issue.
              For billing issues, include your Transaction ID or Razorpay Order ID if available.
            </p>
          </div>
        </div>
      </div>
    </SettingsSectionWrapper>
  );
}
