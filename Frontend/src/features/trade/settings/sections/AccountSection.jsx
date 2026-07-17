import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Crown, Building, ImageOff, Mail, MapPin, LogOut, AlertCircle, Loader2 } from 'lucide-react';
import { selectUser, clearUser } from '@/src/redux/slices/authSlice.js';
import { clearChat } from '@/src/redux/slices/chatSlice.js';
import { clearEntitlements } from '@/src/redux/slices/entitlementSlice.js';
import { selectTradeSubscription } from '@/src/redux/slices/subscriptionSlice.js';
import { selectCanAccessErp } from '@/src/redux/slices/entitlementSlice.js';
import { resetState } from '@/src/redux/store.js';
import { useOrganization } from '@/src/features/trade/organization/hooks/useOrganization.js';
import SettingsSectionWrapper from '../components/SettingsSectionWrapper';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function DataRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(37,99,235,0.06)' }}>
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

const STATUS_STYLES = {
  active:    { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', dot: 'bg-emerald-500 animate-pulse' },
  expired:   { bg: '#fffbeb', border: '#fde68a', color: '#d97706', dot: 'bg-amber-400' },
  cancelled: { bg: '#fef2f2', border: '#fecaca', color: '#dc2626', dot: 'bg-red-400' },
  none:      { bg: '#f8fafc', border: '#e2e8f0', color: '#64748b', dot: 'bg-slate-400' },
};

const PLAN_LABELS = {
  none: 'Free Plan', monthly: 'Monthly', sixMonth: 'Six Month', yearly: 'Yearly',
};

export default function AccountSection() {
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const user         = useSelector(selectUser);
  const trade        = useSelector(selectTradeSubscription);
  const canAccessErp = useSelector(selectCanAccessErp);
  const { organization, loading: orgLoading } = useOrganization({ enabled: canAccessErp });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut,      setLoggingOut]      = useState(false);

  const style     = STATUS_STYLES.active;
  const planLabel = PLAN_LABELS[trade?.planType] ?? 'Free Plan';

  const createdAt  = user?.createdAt  ? new Date(user.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method:      'POST',
        credentials: 'include',
      });
    } catch {}
    dispatch(clearUser());
    dispatch(clearChat());
    dispatch(clearEntitlements());
    dispatch(resetState());
    navigate('/');
  };

  return (
    <SettingsSectionWrapper
      title="Account"
      description="View your account details, organization, and manage your session."
    >
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
          <h3 className="font-bold text-sm" style={{ color: '#0f172a' }}>Account Information</h3>
          <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>Read-only account details</p>
        </div>
        <div className="px-6 py-3">
          <DataRow icon={User}   label="User ID"       value={user?._id?.toString()} />
          <DataRow icon={Shield} label="Provider"      value={user?.provider === 'google' ? 'Google' : 'Email & Password'} />
          {/* <DataRow icon={Crown}  label="Role"          value={user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : '—'} /> */}
          <DataRow icon={User}   label="Account Created" value={createdAt} />
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
          <h3 className="font-bold text-sm" style={{ color: '#0f172a' }}>Subscription Status</h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.1)' }}>
                <Crown size={18} style={{ color: '#2563eb' }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#0f172a' }}>{planLabel}</p>
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1"
                  style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
          <h3 className="font-bold text-sm" style={{ color: '#0f172a' }}>Organization</h3>
          <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>Your registered business details</p>
        </div>
        <div className="px-6 py-5">
          {orgLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={20} className="animate-spin" style={{ color: '#3b82f6' }} />
            </div>
          ) : organization ? (
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center shrink-0 bg-slate-50" style={{ border: '1px solid #e2e8f0' }}>
                {organization.logoUrl
                  ? <img src={organization.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  : <ImageOff size={18} style={{ color: '#cbd5e1' }} />
                }
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{organization.organizationName}</p>
                {organization.organizationEmail && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: '#64748b' }}>
                    <Mail size={11} className="shrink-0" />
                    <span className="truncate">{organization.organizationEmail}</span>
                  </div>
                )}
                {organization.location && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: '#64748b' }}>
                    <MapPin size={11} className="shrink-0" />
                    <span className="truncate">{organization.location}</span>
                  </div>
                )}
                {organization.gstNumber && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: '#64748b' }}>
                    <Building size={11} className="shrink-0" />
                    <span>GST: {organization.gstNumber}</span>
                  </div>
                )}
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1"
                  style={{ background: organization.status === 'active' ? '#f0fdf4' : '#f8fafc', border: `1px solid ${organization.status === 'active' ? '#bbf7d0' : '#e2e8f0'}`, color: organization.status === 'active' ? '#16a34a' : '#64748b' }}
                >
                  {organization.status?.charAt(0).toUpperCase() + organization.status?.slice(1)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Building size={28} className="mb-3" style={{ color: '#cbd5e1' }} />
              <p className="text-sm font-medium" style={{ color: '#64748b' }}>No organization has been created yet.</p>
              <button
                type="button"
                onClick={() => navigate('/trade/add-organization')}
                className="mt-3 text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90"
                style={{ background: 'rgba(37,99,235,0.08)', color: '#1d4ed8' }}
              >
                Create Organization
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #fecaca' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #fef2f2' }}>
          <h3 className="font-bold text-sm text-red-600">Sign Out</h3>
          <p className="text-[11px] mt-0.5 text-red-400">End your current session</p>
        </div>
        <div className="px-6 py-4">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-red-50"
            style={{ border: '1px solid #fecaca', color: '#dc2626' }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" style={{ border: '1px solid #e2e8f0' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-50">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ color: '#0f172a' }}>Sign out of Blinkus?</h3>
                <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>You will need to sign in again to access your account.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                style={{ border: '1px solid #e2e8f0', color: '#64748b' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 bg-red-500 hover:bg-red-600"
              >
                {loggingOut
                  ? <><Loader2 size={14} className="animate-spin" /> Signing out...</>
                  : <><LogOut size={14} /> Sign Out</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </SettingsSectionWrapper>
  );
}
