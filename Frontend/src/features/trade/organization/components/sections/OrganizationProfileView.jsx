import {
  Building2, Mail, MapPin, Hash, Phone, Globe, Globe2,
  CalendarRange, CalendarClock, Flag, ImageOff,
} from 'lucide-react';

function ProfileField({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.1)' }}>
          <Icon size={15} style={{ color: '#2563eb' }} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>{label}</p>
        <p className="text-sm mt-0.5 break-words" style={{ color: value ? '#0f172a' : '#94a3b8' }}>
          {value || 'Not provided'}
        </p>
      </div>
    </div>
  );
}

export default function OrganizationProfileView({ organization }) {  
  if (!organization) return null;

  const { contact = {}, regionalInformation = {} } = organization;
  const countryLabel = regionalInformation.country
    ? `${regionalInformation.country}${regionalInformation.countryCode ? ` (${regionalInformation.countryCode})` : ''}`
    : '';

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div
          className="lg:col-span-2 rounded-2xl bg-white p-4 sm:p-6 space-y-5"
          style={{ border: '1px solid #e2e8f0' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.1)' }}>
              <Building2 size={16} style={{ color: '#2563eb' }} />
            </div>
            <h2 className="text-sm font-semibold" style={{ color: '#0f172a' }}>Organization Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ProfileField label="Organization Name" value={organization.organizationName} icon={Building2} />
            <ProfileField label="Organization Email" value={organization.organizationEmail} icon={Mail} />
            <div className="sm:col-span-2">
              <ProfileField label="Business Location" value={organization.location} icon={MapPin} />
            </div>
            {organization.gstNumber && (
              <div className="sm:col-span-2">
                <ProfileField label="GST Number" value={organization.gstNumber} icon={Hash} />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 sm:p-6 flex flex-col items-center justify-center" style={{ border: '1px solid #e2e8f0' }}>
          <p className="self-start text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#64748b' }}>
            Organization Logo
          </p>
          <div
            className="w-28 h-28 rounded-2xl overflow-hidden flex items-center justify-center bg-slate-50"
            style={{ border: '1px solid #e2e8f0' }}
          >
            {organization.logoUrl ? (
              <img src={organization.logoUrl} alt="Organization logo" className="w-full h-full object-cover" />
            ) : (
              <ImageOff size={24} style={{ color: '#cbd5e1' }} />
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 sm:p-6" style={{ border: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.1)' }}>
            <Phone size={16} style={{ color: '#2563eb' }} />
          </div>
          <h2 className="text-sm font-semibold" style={{ color: '#0f172a' }}>Contact Information</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <ProfileField label="Address" value={contact.address} icon={MapPin} />
          </div>
          <ProfileField label="PIN Code" value={contact.pinCode} icon={Hash} />
          <ProfileField label="Phone Number" value={contact.phone} icon={Phone} />
          <div className="sm:col-span-2">
            <ProfileField label="Website" value={contact.website} icon={Globe} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 sm:p-6" style={{ border: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.1)' }}>
            <Globe2 size={16} style={{ color: '#2563eb' }} />
          </div>
          <h2 className="text-sm font-semibold" style={{ color: '#0f172a' }}>Regional Information</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ProfileField label="Timezone" value={regionalInformation.timezone} icon={Globe2} />
          <ProfileField label="Country" value={countryLabel} icon={Flag} />
          <ProfileField label="Financial Year Start" value={regionalInformation.financialYearStart} icon={CalendarRange} />
          <ProfileField label="Date Format" value={regionalInformation.dateFormat} icon={CalendarClock} />
        </div>
      </div>
    </div>
  );
}
