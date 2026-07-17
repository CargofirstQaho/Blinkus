import { Link } from 'react-router-dom';
import { FileCheck2, CalendarClock, BadgeCheck, ScrollText, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/src/redux/slices/authSlice.js';
import SettingsSectionWrapper from '../components/SettingsSectionWrapper';
import { ACCEPTED_VIA_LABELS } from '../utils/constants';

function StatusBadge({ accepted }) {
  return accepted ? (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}>
      <CheckCircle2 size={12} /> Accepted
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
      <XCircle size={12} /> Not Accepted
    </span>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(37,99,235,0.06)' }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.12)' }}>
        <Icon size={13} style={{ color: '#3b82f6' }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{label}</p>
        <p className="text-xs font-medium truncate mt-0.5" style={{ color: '#334155' }}>{value || '—'}</p>
      </div>
    </div>
  );
}

export default function PrivacySection() {
  const user = useSelector(selectUser);
  const terms = user?.termsAcceptance;

  const acceptedAt = terms?.acceptedAt
    ? new Date(terms.acceptedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : null;

  const acceptedVia = terms?.acceptedVia
    ? (ACCEPTED_VIA_LABELS[terms.acceptedVia] || terms.acceptedVia)
    : null;

  return (
    <SettingsSectionWrapper
      title="Privacy"
      description="Review your legal consent status for Terms of Service and Privacy Policy."
    >
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#0f172a' }}>Terms & Conditions</h3>
            <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>Your consent to the Terms of Service</p>
          </div>
          <StatusBadge accepted={terms?.accepted ?? false} />
        </div>
        <div className="px-6 py-3">
          <InfoItem icon={FileCheck2}   label="Terms Accepted"   value={terms?.accepted ? 'Yes' : 'No'} />
          <InfoItem icon={CalendarClock} label="Accepted Date"   value={acceptedAt || 'Not yet accepted'} />
          <InfoItem icon={BadgeCheck}   label="Version"          value={terms?.version} />
          <InfoItem icon={ScrollText}   label="Accepted Via"     value={acceptedVia} />
        </div>
        <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(37,99,235,0.06)' }}>
          <Link
            to="/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:underline"
            style={{ color: '#2563eb' }}
          >
            <ExternalLink size={14} /> Read Terms of Service
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#0f172a' }}>Privacy Policy</h3>
            <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>Your consent to the Privacy Policy</p>
          </div>
          <StatusBadge accepted={terms?.accepted ?? false} />
        </div>
        <div className="px-6 py-3">
          <InfoItem icon={FileCheck2}   label="Privacy Accepted" value={terms?.accepted ? 'Yes' : 'No'} />
          <InfoItem icon={CalendarClock} label="Accepted Date"   value={acceptedAt || 'Not yet accepted'} />
          <InfoItem icon={BadgeCheck}   label="Version"          value={terms?.version} />
          <InfoItem icon={ScrollText}   label="Accepted Via"     value={acceptedVia} />
        </div>
        <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(37,99,235,0.06)' }}>
          <Link
            to="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:underline"
            style={{ color: '#2563eb' }}
          >
            <ExternalLink size={14} /> Read Privacy Policy
          </Link>
        </div>
      </div>

      <div
        className="flex items-start gap-3 px-5 py-4 rounded-2xl"
        style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.1)' }}
      >
        <FileCheck2 size={15} className="shrink-0 mt-0.5" style={{ color: '#2563eb' }} />
        <p className="text-xs leading-relaxed" style={{ color: '#1e40af' }}>
          Both the Terms of Service and Privacy Policy are accepted together during account registration or when policies are updated. Your acceptance date and version are recorded above.
        </p>
      </div>
    </SettingsSectionWrapper>
  );
}
