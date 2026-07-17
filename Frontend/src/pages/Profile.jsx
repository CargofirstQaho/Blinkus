import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Phone, Building, Save, Camera, Lock, CheckCircle2, Shield, MapPin, ImageOff, Loader2, ScrollText, FileCheck2, CalendarClock, BadgeCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { selectUser, setUser } from '../redux/slices/authSlice';
import { apiFetch, SessionExpiredError } from '../lib/apiFetch';
import { cn } from '../lib/utils';
// import SubscriptionStatusCard from '../components/dashboard/subscriptions/components/SubscriptionStatusCard';
import { useEntitlements } from '../components/dashboard/subscriptions/hooks/useEntitlements';
import { useOrganization } from '../features/trade/organization/hooks/useOrganization';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Profile() {
  const dispatch = useDispatch();
  const user     = useSelector(selectUser);
  const { trade, canAccessErp } = useEntitlements();

  const { organization, loading: orgLoading } = useOrganization({ enabled: canAccessErp });

  const [form, setForm] = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    mobile:  user?.mobile  || '',
    company: user?.company || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Full name is required'); return; }

    setSaving(true);
    try {
      const response = await apiFetch(`${BACKEND_URL}/api/user`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:    form.name.trim(),
          mobile:  form.mobile.trim(),
          company: form.company.trim(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
      dispatch(setUser({ user: data.data.user }));
      toast.success('Profile updated');
    } catch (err) {
      if (err instanceof SessionExpiredError) return;
      if (err.name === 'TypeError') {
        toast.error('Cannot connect to server. Please try again.');
      } else {
        toast.error(err.message || 'Something went wrong');
      }
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: 'name',    label: 'Full Name',     icon: User,     type: 'text',  readOnly: false },
    { name: 'email',   label: 'Email Address', icon: Mail,     type: 'email', readOnly: true  },
    { name: 'mobile',  label: 'Mobile Number', icon: Phone,    type: 'tel',   readOnly: false },
    { name: 'company', label: 'Company',       icon: Building, type: 'text',  readOnly: false },
  ];

  const initials = (user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('');

  const termsAcceptance = user?.termsAcceptance;
  const acceptedViaLabels = {
    signup:      'Signup',
    'google-auth': 'Google Sign-In',
    'policy-update': 'Policy Update',
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-7">
          <h1 className="text-2xl font-display font-bold" style={{ color: '#0f172a' }}>
            Profile
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            Manage your personal information and account details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

          <div className="lg:col-span-1 flex flex-col gap-5 sm:gap-6">
            {/* <SubscriptionStatusCard trade={trade} /> */}

            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}
            >
              <div
                className="relative h-24 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #f0f6ff 0%, #e8f0fe 55%, #eff6ff 100%)' }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(37,99,235,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.07) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                />
                <div
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)' }}
                />
              </div>

              <div className="flex justify-center -mt-10 relative z-10 px-5">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                      boxShadow: '0 6px 20px rgba(37,99,235,0.28)',
                    }}
                  >
                    {initials}
                  </div>
                  <button
                    type="button"
                    aria-label="Change profile photo"
                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white rounded-lg flex items-center justify-center transition-colors hover:bg-blue-50"
                    style={{ border: '1px solid rgba(37,99,235,0.15)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                  >
                    <Camera size={13} style={{ color: '#3b82f6' }} />
                  </button>
                </div>
              </div>

              <div className="px-5 pt-3 pb-5">
                <div className="text-center mb-4">
                  <h2 className="font-bold text-base leading-snug" style={{ color: '#0f172a' }}>
                    {user?.name || 'Your Name'}
                  </h2>
                  <p className="text-xs mt-0.5 truncate" style={{ color: '#94a3b8' }}>
                    {user?.email}
                  </p>
                  <div
                    className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Account
                  </div>
                </div>

                <div className="space-y-1.5 pt-3.5" style={{ borderTop: '1px solid rgba(37,99,235,0.08)' }}>
                  {[
                    { icon: Mail,     label: 'Email',   value: user?.email   || '—'        },
                    { icon: Phone,    label: 'Mobile',  value: user?.mobile  || 'Not set'  },
                    { icon: Building, label: 'Company', value: user?.company || 'Not set'  },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-2.5 py-1.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.12)' }}
                      >
                        <Icon size={13} style={{ color: '#3b82f6' }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-[9px] font-bold uppercase tracking-widest"
                          style={{ color: '#94a3b8' }}
                        >
                          {label}
                        </p>
                        <p className="text-xs font-medium truncate mt-0.5" style={{ color: '#334155' }}>
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-4 p-3 rounded-xl flex items-center gap-2.5"
                  style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.1)' }}
                >
                  <Shield size={13} style={{ color: '#2563eb' }} className="shrink-0" />
                  <p className="text-[11px] font-medium leading-snug" style={{ color: '#1e40af' }}>
                    Your data is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}
            >
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}
              >
                <div>
                  <h2 className="font-bold text-sm" style={{ color: '#0f172a' }}>
                    Edit Profile
                  </h2>
                  <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>
                    Update your personal details below
                  </p>
                </div>
                <div
                  className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.15)', color: '#2563eb' }}
                >
                  <CheckCircle2 size={11} />
                  Verified
                </div>
              </div>

              <form onSubmit={handleSave} className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {fields.map(({ name, label, icon: Icon, type, readOnly }) => (
                    <div key={name} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor={`field-${name}`}
                          className="text-xs font-semibold"
                          style={{ color: '#475569' }}
                        >
                          {label}
                        </label>
                        {readOnly && (
                          <span
                            className="flex items-center gap-1 text-[10px] font-medium"
                            style={{ color: '#94a3b8' }}
                          >
                            <Lock size={9} />
                            Read-only
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Icon
                          size={14}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none"
                          style={{ color: readOnly ? '#cbd5e1' : '#3b82f6' }}
                        />
                        <input
                          id={`field-${name}`}
                          type={type}
                          name={name}
                          value={form[name]}
                          onChange={readOnly ? undefined : handleChange}
                          readOnly={readOnly}
                          disabled={saving}
                          placeholder={readOnly ? undefined : `Enter your ${label.toLowerCase()}`}
                          className={cn(
                            'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all',
                            readOnly
                              ? 'cursor-not-allowed'
                              : 'disabled:opacity-60'
                          )}
                          style={
                            readOnly
                              ? {
                                  background: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  color: '#94a3b8',
                                }
                              : {
                                  background: '#ffffff',
                                  border: '1px solid #e2e8f0',
                                  color: '#0f172a',
                                }
                          }
                          onFocus={readOnly ? undefined : (e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
                          }}
                          onBlur={readOnly ? undefined : (e) => {
                            e.target.style.borderColor = '#e2e8f0';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-5"
                  style={{ borderTop: '1px solid rgba(37,99,235,0.08)' }}
                >
                  <p className="text-xs" style={{ color: '#94a3b8' }}>
                    Email address cannot be changed for security reasons.
                  </p>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 whitespace-nowrap shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                      boxShadow: saving ? 'none' : '0 4px 14px rgba(37,99,235,0.28)',
                    }}
                  >
                    {saving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

        {(orgLoading || organization) && (
          <div
            className="mt-5 sm:mt-6 bg-white rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}
          >
            <div
              className="px-6 py-4"
              style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}
            >
              <h2 className="font-bold text-sm" style={{ color: '#0f172a' }}>Organization</h2>
              <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>Your registered business details</p>
            </div>

            {orgLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={20} className="animate-spin" style={{ color: '#3b82f6' }} />
              </div>
            ) : (
              <div className="p-6 flex flex-col sm:flex-row items-start gap-5">
                <div
                  className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 bg-slate-50"
                  style={{ border: '1px solid #e2e8f0' }}
                >
                  {organization.logoUrl ? (
                    <img src={organization.logoUrl} alt="Organization logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff size={20} style={{ color: '#cbd5e1' }} />
                  )}
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                  <p className="font-semibold text-sm leading-snug" style={{ color: '#0f172a' }}>
                    {organization.organizationName}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: '#64748b' }}>
                    <Mail size={12} className="shrink-0" />
                    <span className="truncate">{organization.organizationEmail}</span>
                  </div>
                  {organization.location && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#64748b' }}>
                      <MapPin size={12} className="shrink-0" />
                      <span>{organization.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div
          className="mt-5 sm:mt-6 bg-white rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}
        >
          <div
            className="px-6 py-4"
            style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}
          >
            <h2 className="font-bold text-sm" style={{ color: '#0f172a' }}>Legal & Compliance</h2>
            <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>Your Terms of Service and Privacy Policy consent status</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                {
                  icon: FileCheck2,
                  label: 'Terms Accepted',
                  value: termsAcceptance?.accepted ? 'Yes' : 'No',
                },
                {
                  icon: CalendarClock,
                  label: 'Accepted Date',
                  value: termsAcceptance?.acceptedAt
                    ? new Date(termsAcceptance.acceptedAt).toLocaleString()
                    : 'Not yet accepted',
                },
                {
                  icon: BadgeCheck,
                  label: 'Accepted Version',
                  value: termsAcceptance?.version || '—',
                },
                {
                  icon: ScrollText,
                  label: 'Accepted Via',
                  value: termsAcceptance?.acceptedVia
                    ? (acceptedViaLabels[termsAcceptance.acceptedVia] || termsAcceptance.acceptedVia)
                    : '—',
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.12)' }}
                  >
                    <Icon size={13} style={{ color: '#3b82f6' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>
                      {label}
                    </p>
                    <p className="text-xs font-medium truncate mt-0.5" style={{ color: '#334155' }}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex flex-col sm:flex-row gap-3 pt-5"
              style={{ borderTop: '1px solid rgba(37,99,235,0.08)' }}
            >
              <Link
                to="/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors hover:bg-blue-50"
                style={{ border: '1px solid rgba(37,99,235,0.15)', color: '#2563eb' }}
              >
                Read Terms of Service
              </Link>
              <Link
                to="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors hover:bg-blue-50"
                style={{ border: '1px solid rgba(37,99,235,0.15)', color: '#2563eb' }}
              >
                Read Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
