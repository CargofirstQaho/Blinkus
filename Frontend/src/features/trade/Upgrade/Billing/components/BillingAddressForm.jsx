import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils.js';

const INITIAL = {
  fullName:     '',
  email:        '',
  phone:        '',
  companyName:  '',
  country:      '',
  state:        '',
  city:         '',
  postalCode:   '',
  addressLine1: '',
  addressLine2: '',
  isDefault:    false,
};

function Field({ label, error, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-black/50 uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function Input({ error, ...props }) {
  return (
    <input
      {...props}
      className={cn(
        'w-full px-3 py-2.5 rounded-xl text-sm bg-white border transition-colors outline-none',
        'placeholder:text-black/25',
        'focus:ring-2 focus:ring-accent/30 focus:border-accent',
        error ? 'border-red-300 bg-red-50/40' : 'border-black/10 hover:border-black/20'
      )}
    />
  );
}

function validate(form) {
  const errors = {};
  if (!form.fullName.trim())     errors.fullName     = 'Full name is required';
  if (!form.email.trim())        errors.email        = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Must be a valid email';
  if (!form.phone.trim())        errors.phone        = 'Phone number is required';
  else if (!/^[+\d\s\-()]{7,20}$/.test(form.phone)) errors.phone = 'Must be a valid phone number';
  if (!form.country.trim())      errors.country      = 'Country is required';
  if (!form.state.trim())        errors.state        = 'State is required';
  if (!form.city.trim())         errors.city         = 'City is required';
  if (!form.postalCode.trim())   errors.postalCode   = 'Postal code is required';
  if (!form.addressLine1.trim()) errors.addressLine1 = 'Address line 1 is required';
  return errors;
}

function toFormValues(initialValues) {
  const merged = { ...INITIAL };
  for (const key of Object.keys(INITIAL)) {
    if (initialValues[key] !== null && initialValues[key] !== undefined) {
      merged[key] = initialValues[key];
    }
  }
  return merged;
}

export default function BillingAddressForm({ initialValues = null, onSubmit, onCancel, submitLabel = 'Save Address' }) {
  const [form,    setForm]    = useState(initialValues ? toFormValues(initialValues) : INITIAL);
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [apiError, setApiError] = useState(null);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (apiError)    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    setApiError(null);
    try {
      await onSubmit({
        fullName:     form.fullName.trim(),
        email:        form.email.trim().toLowerCase(),
        phone:        form.phone.trim(),
        companyName:  form.companyName.trim()  || null,
        country:      form.country.trim(),
        state:        form.state.trim(),
        city:         form.city.trim(),
        postalCode:   form.postalCode.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim() || null,
        isDefault:    form.isDefault,
      });
    } catch (err) {
      setApiError(err.message || 'Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" error={errors.fullName} required>
          <Input
            type="text"
            placeholder="John Doe"
            value={form.fullName}
            onChange={set('fullName')}
            error={errors.fullName}
            autoComplete="name"
          />
        </Field>

        <Field label="Email Address" error={errors.email} required>
          <Input
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            autoComplete="email"
          />
        </Field>

        <Field label="Phone Number" error={errors.phone} required>
          <Input
            type="tel"
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={set('phone')}
            error={errors.phone}
            autoComplete="tel"
          />
        </Field>

        <Field label="Company Name" error={errors.companyName}>
          <Input
            type="text"
            placeholder="Optional"
            value={form.companyName}
            onChange={set('companyName')}
            error={errors.companyName}
            autoComplete="organization"
          />
        </Field>
      </div>

      <Field label="Address Line 1" error={errors.addressLine1} required>
        <Input
          type="text"
          placeholder="Street address, building name"
          value={form.addressLine1}
          onChange={set('addressLine1')}
          error={errors.addressLine1}
          autoComplete="address-line1"
        />
      </Field>

      <Field label="Address Line 2" error={errors.addressLine2}>
        <Input
          type="text"
          placeholder="Apartment, suite, floor (optional)"
          value={form.addressLine2}
          onChange={set('addressLine2')}
          error={errors.addressLine2}
          autoComplete="address-line2"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sm:col-span-1 lg:col-span-2">
          <Field label="Country" error={errors.country} required>
            <Input
              type="text"
              placeholder="India"
              value={form.country}
              onChange={set('country')}
              error={errors.country}
              autoComplete="country-name"
            />
          </Field>
        </div>

        <Field label="State" error={errors.state} required>
          <Input
            type="text"
            placeholder="Maharashtra"
            value={form.state}
            onChange={set('state')}
            error={errors.state}
            autoComplete="address-level1"
          />
        </Field>

        <Field label="City" error={errors.city} required>
          <Input
            type="text"
            placeholder="Mumbai"
            value={form.city}
            onChange={set('city')}
            error={errors.city}
            autoComplete="address-level2"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Postal Code" error={errors.postalCode} required>
          <Input
            type="text"
            placeholder="400001"
            value={form.postalCode}
            onChange={set('postalCode')}
            error={errors.postalCode}
            autoComplete="postal-code"
          />
        </Field>

        <div className="flex items-end pb-1">
          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={set('isDefault')}
              className="w-4 h-4 rounded accent-[#6495ED] cursor-pointer"
            />
            <span className="text-sm text-black/60">Set as default address</span>
          </label>
        </div>
      </div>

      {apiError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {apiError}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className={cn(
            'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
            saving ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'
          )}
          style={{ background: 'linear-gradient(135deg, #5080d8 0%, #6495ED 100%)' }}
        >
          {saving && <Loader2 size={14} className="animate-spin shrink-0" />}
          {submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-black/50 hover:text-black/70 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
