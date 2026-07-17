import { Building2 } from 'lucide-react';
import FormSection from './FormSection';
import FormField from './FormField';

const base = 'w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all bg-white placeholder:text-slate-400';
const bdr = (err) => ({ border: `1px solid ${err ? '#fca5a5' : '#e2e8f0'}`, color: '#0f172a' });
const fOn = (ev, err) => {
  ev.target.style.borderColor = err ? '#dc2626' : '#3b82f6';
  ev.target.style.boxShadow = err ? '0 0 0 3px rgba(220,38,38,0.12)' : '0 0 0 3px rgba(59,130,246,0.12)';
};
const fOff = (ev, err) => {
  ev.target.style.borderColor = err ? '#fca5a5' : '#e2e8f0';
  ev.target.style.boxShadow = 'none';
};

export default function PartySection({
  title,
  icon = Building2,
  prefix,
  register,
  errors = {},
  nameLabel = 'Company Name',
  showFullAddress = true,
}) {
  const e = (field) => errors[`${prefix}${field}`];

  return (
    <FormSection title={title} icon={icon}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label={nameLabel} required error={e('Name')}>
            <input
              {...register(`${prefix}Name`)}
              placeholder={`Enter ${nameLabel.toLowerCase()}`}
              className={base}
              style={bdr(!!e('Name'))}
              onFocus={(ev) => fOn(ev, !!e('Name'))}
              onBlur={(ev) => fOff(ev, !!e('Name'))}
            />
          </FormField>

          <FormField label="Contact Person" error={e('Contact')}>
            <input
              {...register(`${prefix}Contact`)}
              placeholder="Contact person name"
              className={base}
              style={bdr(!!e('Contact'))}
              onFocus={(ev) => fOn(ev, !!e('Contact'))}
              onBlur={(ev) => fOff(ev, !!e('Contact'))}
            />
          </FormField>

          <FormField label="Email" error={e('Email')}>
            <input
              {...register(`${prefix}Email`)}
              type="email"
              placeholder="email@example.com"
              className={base}
              style={bdr(!!e('Email'))}
              onFocus={(ev) => fOn(ev, !!e('Email'))}
              onBlur={(ev) => fOff(ev, !!e('Email'))}
            />
          </FormField>

          <FormField label="Phone" error={e('Phone')}>
            <input
              {...register(`${prefix}Phone`)}
              placeholder="+91 98765 43210"
              className={base}
              style={bdr(!!e('Phone'))}
              onFocus={(ev) => fOn(ev, !!e('Phone'))}
              onBlur={(ev) => fOff(ev, !!e('Phone'))}
            />
          </FormField>

          <FormField label="GST Number" error={e('Gst')}>
            <input
              {...register(`${prefix}Gst`)}
              placeholder="22AAAAA0000A1Z5"
              className={`${base} uppercase font-mono tracking-wider`}
              style={bdr(!!e('Gst'))}
              onFocus={(ev) => fOn(ev, !!e('Gst'))}
              onBlur={(ev) => fOff(ev, !!e('Gst'))}
            />
          </FormField>
        </div>

        <FormField label="Address" error={e('Address')}>
          <textarea
            {...register(`${prefix}Address`)}
            rows={2}
            placeholder="Street address / building name"
            className={base}
            style={{ ...bdr(!!e('Address')), resize: 'none' }}
            onFocus={(ev) => fOn(ev, !!e('Address'))}
            onBlur={(ev) => fOff(ev, !!e('Address'))}
          />
        </FormField>

        {showFullAddress && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { field: 'City',       placeholder: 'City'    },
              { field: 'State',      placeholder: 'State'   },
              { field: 'Country',    placeholder: 'India'   },
              { field: 'PostalCode', placeholder: '400001'  },
            ].map(({ field, placeholder }) => (
              <FormField key={field} label={field.replace('PostalCode', 'Postal Code')} error={e(field)}>
                <input
                  {...register(`${prefix}${field}`)}
                  placeholder={placeholder}
                  className={base}
                  style={bdr(!!e(field))}
                  onFocus={(ev) => fOn(ev, !!e(field))}
                  onBlur={(ev) => fOff(ev, !!e(field))}
                />
              </FormField>
            ))}
          </div>
        )}
      </div>
    </FormSection>
  );
}
