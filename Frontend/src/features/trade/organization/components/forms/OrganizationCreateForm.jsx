import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Mail, MapPin, Hash, Contact, Globe2, Loader2, ShieldPlus } from 'lucide-react';
import TextField from './TextField';
import LogoUploader from '../upload/LogoUploader';
import ExpandableSection from '../sections/ExpandableSection';
import ContactInformationSection from '../sections/ContactInformationSection';
import RegionalInformationSection from '../sections/RegionalInformationSection';
import OrganizationNoticeCard from '../sections/OrganizationNoticeCard';
import { organizationInfoSchema, organizationDefaultValues } from '../../schemas/organizationSchema';

export default function OrganizationCreateForm({ saving, onSave, onUploadLogo }) {
  const [logoKey, setLogoKey] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(organizationInfoSchema),
    defaultValues: organizationDefaultValues,
    mode: 'onBlur',
  });

  const handleUploadLogo = async (file) => {
    setUploadingLogo(true);
    try {
      const key = await onUploadLogo(file);
      setLogoKey(key);
      setLogoError(false);
    } finally {
      setUploadingLogo(false);
    }
  };

  const onSubmit = async (values) => {
    await onSave({ ...values, logoKey });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div
          className="lg:col-span-2 rounded-2xl bg-white p-4 sm:p-6 space-y-4 sm:space-y-5"
          style={{ border: '1px solid #e2e8f0' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.1)' }}>
              <Building2 size={16} style={{ color: '#2563eb' }} />
            </div>
            <h2 className="text-sm font-semibold" style={{ color: '#0f172a' }}>Organization Details</h2>
          </div>

          <TextField
            label="Organization Name"
            name="organizationName"
            register={register}
            error={errors.organizationName}
            icon={Building2}
            placeholder="e.g. Blinkus Trading Co."
            required
          />
          <TextField
            label="Organization Email"
            name="organizationEmail"
            type="email"
            register={register}
            error={errors.organizationEmail}
            icon={Mail}
            placeholder="e.g. contact@yourcompany.com"
            required
          />
          <TextField
            label="Business Location"
            name="location"
            register={register}
            error={errors.location}
            icon={MapPin}
            placeholder="e.g. Mumbai, Maharashtra, India"
            required
          />
          <TextField
            label="GST Number"
            name="gstNumber"
            register={register}
            error={errors.gstNumber}
            icon={Hash}
            placeholder="e.g. 22AAAAA0000A1Z5"
          />
        </div>

        <div className="rounded-2xl bg-white p-4 sm:p-6 flex flex-col" style={{ border: `1px solid ${logoError ? '#fca5a5' : '#e2e8f0'}` }}>
          <LogoUploader
            logoUrl={null}
            uploading={uploadingLogo}
            onUpload={handleUploadLogo}
          />
          {logoError && (
            <p className="text-xs mt-2" style={{ color: '#ef4444' }}>Company logo is required.</p>
          )}
        </div>
      </div>

      <ExpandableSection
        title="Contact Information"
        description="Address, PIN code, phone number and website"
        icon={Contact}
      >
        <ContactInformationSection register={register} errors={errors.contact} />
      </ExpandableSection>

      <ExpandableSection
        title="Regional Information"
        description="Timezone, country, financial year and date format"
        icon={Globe2}
      >
        <RegionalInformationSection
          control={control}
          register={register}
          errors={errors.regionalInformation}
          setValue={setValue}
        />
      </ExpandableSection>

      <OrganizationNoticeCard
        variant="warning"
        title="Important"
        message="Organization details cannot be edited, deleted, or replaced after submission. Please verify all information carefully before continuing."
      />

      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type={logoKey ? 'submit' : 'button'}
          disabled={saving}
          onClick={() => { if (!logoKey) setLogoError(true); }}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60 ${logoKey ? 'hover:opacity-90 active:scale-95' : 'opacity-60 cursor-not-allowed'}`}
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', boxShadow: '0 4px 14px rgba(37,99,235,0.28)' }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <ShieldPlus size={16} />}
          {saving ? 'Registering...' : 'Register Organization'}
        </button>
      </div>
    </form>
  );
}
