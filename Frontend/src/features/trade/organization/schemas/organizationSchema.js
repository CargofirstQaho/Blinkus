import { z } from 'zod';

const PHONE_REGEX = /^\+?[\d\s\-()]{7,20}$/;
const PIN_REGEX = /^[A-Za-z0-9\s\-]{3,12}$/;
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-./?%&=]*)?$/i;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export const organizationInfoSchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(2, 'Organization name must be at least 2 characters')
    .max(120, 'Organization name must be under 120 characters'),

  organizationEmail: z
    .string()
    .trim()
    .min(1, 'Organization email is required')
    .email('Enter a valid email address'),

  location: z
    .string()
    .trim()
    .min(1, 'Business location is required')
    .max(200, 'Location must be under 200 characters'),

  gstNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(GST_REGEX, 'Enter a valid GST number (e.g. 22AAAAA0000A1Z5)')
    .optional()
    .or(z.literal('')),

  contact: z.object({
    address: z.string().trim().max(300, 'Address must be under 300 characters').optional().or(z.literal('')),
    pinCode: z
      .string()
      .trim()
      .min(1, 'PIN code is required')
      .regex(PIN_REGEX, 'Enter a valid PIN / postal code'),
    phone: z
      .string()
      .trim()
      .min(1, 'Phone number is required')
      .regex(PHONE_REGEX, 'Enter a valid phone number'),
    website: z
      .string()
      .trim()
      .regex(URL_REGEX, 'Enter a valid website URL')
      .optional()
      .or(z.literal('')),
  }),

  regionalInformation: z.object({
    timezone: z.string().trim().min(1, 'Timezone is required'),
    country: z.string().trim().min(1, 'Country is required'),
    countryCode: z.string().trim().min(1, 'Country is required'),
    financialYearStart: z.string().trim().min(1, 'Financial year start is required'),
    dateFormat: z.string().trim().min(1, 'Date format is required'),
  }),
});

export const organizationDefaultValues = {
  organizationName: '',
  organizationEmail: '',
  location: '',
  gstNumber: '',
  contact: {
    address: '',
    pinCode: '',
    phone: '',
    website: '',
  },
  regionalInformation: {
    timezone: '',
    country: '',
    countryCode: '',
    financialYearStart: '',
    dateFormat: '',
  },
};
