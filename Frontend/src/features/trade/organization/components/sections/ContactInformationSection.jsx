import { MapPin, Hash, Phone, Globe } from 'lucide-react';
import TextField from '../forms/TextField';

export default function ContactInformationSection({ register, errors }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      <div className="sm:col-span-2">
        <TextField
          label="Address"
          name="contact.address"
          register={register}
          error={errors?.address}
          icon={MapPin}
          placeholder="Street, area, city"
        />
      </div>
      <TextField
        label="PIN Code"
        name="contact.pinCode"
        register={register}
        error={errors?.pinCode}
        icon={Hash}
        placeholder="e.g. 110001"
        required
      />
      <TextField
        label="Phone Number"
        name="contact.phone"
        register={register}
        error={errors?.phone}
        icon={Phone}
        placeholder="e.g. +91 98765 43210"
        required
      />
      <div className="sm:col-span-2">
        <TextField
          label="Website"
          name="contact.website"
          register={register}
          error={errors?.website}
          icon={Globe}
          placeholder="e.g. https://www.example.com"
        />
      </div>
    </div>
  );
}
