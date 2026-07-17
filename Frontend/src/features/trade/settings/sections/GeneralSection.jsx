import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, Building, Save, Lock, Camera, Shield, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { selectUser, setUser } from '@/src/redux/slices/authSlice.js';
import { apiFetch, SessionExpiredError } from '@/src/lib/apiFetch.js';
import SettingsSectionWrapper from '../components/SettingsSectionWrapper';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function InfoPill({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 rounded-xl" style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.08)' }}>
      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{label}</span>
      <span className="text-xs font-medium truncate" style={{ color: '#334155' }}>{value || '—'}</span>
    </div>
  );
}

export default function GeneralSection() {
  const dispatch = useDispatch();
  const user     = useSelector(selectUser);

  const initials = (user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('');

  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    name:    user?.name    || '',
    mobile:  user?.mobile  || '',
    company: user?.company || '',
  });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleEdit = () => {
    setForm({ name: user?.name || '', mobile: user?.mobile || '', company: user?.company || '' });
    setEditing(true);
  };

  const handleCancel = () => {
    setForm({ name: user?.name || '', mobile: user?.mobile || '', company: user?.company || '' });
    setEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Full name is required'); return; }
    setSaving(true);
    try {
      const res = await apiFetch(`${BACKEND_URL}/api/user`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:    form.name.trim(),
          mobile:  form.mobile.trim(),
          company: form.company.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      dispatch(setUser({ user: data.data.user }));
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      if (err instanceof SessionExpiredError) return;
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const createdDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  const providerLabel = user?.provider === 'google' ? 'Google' : 'Email & Password';

  return (
    <SettingsSectionWrapper
      title="General"
      description="Manage your personal information and account preferences."
    >
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}>
        <div className="relative h-20" style={{ background: 'linear-gradient(135deg, #f0f6ff 0%, #e8f0fe 55%, #eff6ff 100%)' }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(37,99,235,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 pb-6 -mt-8">
          <div className="relative shrink-0">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold select-none"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', boxShadow: '0 6px 20px rgba(37,99,235,0.28)' }}
            >
              {initials}
            </div>
            <button
              type="button"
              aria-label="Change profile photo"
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-lg flex items-center justify-center transition-colors hover:bg-blue-50"
              style={{ border: '1px solid rgba(37,99,235,0.15)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
            >
              <Camera size={11} style={{ color: '#3b82f6' }} />
            </button>
          </div>
          <div className="flex-1 min-w-0 pt-4 sm:pt-8">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-base" style={{ color: '#0f172a' }}>{user?.name || 'Your Name'}</h3>
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-xs mt-0.5 truncate" style={{ color: '#94a3b8' }}>{user?.email}</p>
            <p className="text-[11px] mt-1" style={{ color: '#94a3b8' }}>Member since {createdDate}</p>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={handleEdit}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', color: '#2563eb' }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
            <div>
              <h3 className="font-bold text-sm" style={{ color: '#0f172a' }}>Edit Profile</h3>
              <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>Update your personal details below</p>
            </div>
            <CheckCircle2 size={15} style={{ color: '#3b82f6' }} />
          </div>
          <form onSubmit={handleSave} className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                { name: 'name',    label: 'Full Name',     icon: User,     type: 'text' },
                { name: 'mobile',  label: 'Mobile Number', icon: Phone,    type: 'tel'  },
                { name: 'company', label: 'Company',       icon: Building, type: 'text' },
              ].map(({ name, label, icon: Icon, type }) => (
                <div key={name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: '#475569' }}>{label}</label>
                  <div className="relative">
                    <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#3b82f6' }} />
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder={`Enter your ${label.toLowerCase()}`}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all disabled:opacity-60"
                      style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }}
                      onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold" style={{ color: '#475569' }}>Email Address</label>
                  <span className="flex items-center gap-1 text-[10px]" style={{ color: '#94a3b8' }}>
                    <Lock size={9} /> Read-only
                  </span>
                </div>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#cbd5e1' }} />
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm cursor-not-allowed"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#94a3b8' }}
                  />
                </div>
              </div>
            </div>

            <div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-5"
              style={{ borderTop: '1px solid rgba(37,99,235,0.08)' }}
            >
              <p className="text-xs" style={{ color: '#94a3b8' }}>Email address cannot be changed for security reasons.</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
                  style={{ border: '1px solid #e2e8f0', color: '#64748b' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', boxShadow: saving ? 'none' : '0 4px 14px rgba(37,99,235,0.28)' }}
                >
                  {saving
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                    : <><Save size={14} /> Save Changes</>
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 1px 12px rgba(37,99,235,0.06)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
          <h3 className="font-bold text-sm" style={{ color: '#0f172a' }}>Profile Information</h3>
          <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>Read-only account details</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <InfoPill label="Email"    value={user?.email}                               />
            <InfoPill label="Mobile"   value={user?.mobile  || 'Not set'}                />
            <InfoPill label="Company"  value={user?.company || 'Not set'}                />
            <InfoPill label="Provider" value={providerLabel}                             />
            <InfoPill label="Member Since" value={createdDate}                           />
          </div>
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.1)' }}
          >
            <Shield size={13} style={{ color: '#2563eb' }} className="shrink-0" />
            <p className="text-[11px] font-medium" style={{ color: '#1e40af' }}>Your data is secure and encrypted</p>
          </div>
        </div>
      </div>
    </SettingsSectionWrapper>
  );
}
