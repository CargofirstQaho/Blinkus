import { Controller } from 'react-hook-form';
import SearchableSelectField from '../forms/SearchableSelectField';
import SelectField from '../forms/SelectField';
import { COUNTRIES, FINANCIAL_YEAR_MONTHS, DATE_FORMATS, TIMEZONES } from '../../data/regionalData';

const timezoneOptions = TIMEZONES.map((tz) => ({ value: tz, label: tz }));
const countryOptions = COUNTRIES.map((c) => ({ value: c.code, label: `${c.name} (${c.code})` }));
const financialYearOptions = FINANCIAL_YEAR_MONTHS.map((m) => ({ value: m, label: m }));
const dateFormatOptions = DATE_FORMATS.map((f) => ({ value: f, label: f }));

export default function RegionalInformationSection({ control, register, errors, setValue }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      <Controller
        control={control}
        name="regionalInformation.timezone"
        render={({ field }) => (
          <SearchableSelectField
            label="Timezone"
            name="regionalInformation.timezone"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            options={timezoneOptions}
            placeholder="Search timezone (e.g. Asia/Calcutta)"
            error={errors?.timezone}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="regionalInformation.country"
        render={({ field }) => (
          <SearchableSelectField
            label="Country"
            name="regionalInformation.country"
            value={field.value}
            onChange={(code) => {
              field.onChange(code);
              const selected = COUNTRIES.find((c) => c.code === code);
              setValue('regionalInformation.countryCode', selected?.code ?? '', { shouldValidate: true });
            }}
            onBlur={field.onBlur}
            options={countryOptions}
            placeholder="Search country (e.g. India (IN))"
            error={errors?.country}
            required
          />
        )}
      />

      <input type="hidden" {...register('regionalInformation.countryCode')} />

      <SelectField
        label="Financial Year Start"
        name="regionalInformation.financialYearStart"
        register={register}
        error={errors?.financialYearStart}
        options={financialYearOptions}
        placeholder="Select starting month"
        required
      />

      <SelectField
        label="Date Format"
        name="regionalInformation.dateFormat"
        register={register}
        error={errors?.dateFormat}
        options={dateFormatOptions}
        placeholder="Select date format"
        required
      />
    </div>
  );
}
