import { z } from 'zod';

const lineItemSchema = z.object({
  itemCode:      z.string().optional(),
  description:   z.string().min(1, 'Description is required'),
  hsnCode:       z.string().optional(),
  quantity:      z.coerce.number().positive('Must be > 0'),
  unit:          z.string().min(1, 'Required'),
  unitPrice:     z.coerce.number().nonnegative('Must be ≥ 0'),
  discount:      z.coerce.number().min(0).max(100).optional().default(0),
  taxPercentage: z.string().default('18'),
});

export const debitNoteSchema = z.object({
  dnNumber:            z.string().min(1, 'Debit Note Number is required'),
  dnDate:              z.string().min(1, 'Date is required'),
  originalPoNo:        z.string().optional(),
  originalPoDate:      z.string().optional(),
  currency:            z.string().min(1),
  status:              z.string().min(1),
  taxType:             z.enum(['cgst_sgst', 'igst']).default('cgst_sgst'),
  debitReason:         z.string().optional(),

  vendorName:    z.string().min(1, 'Vendor name is required'),
  vendorContact: z.string().optional(),
  vendorEmail:   z.string().optional(),
  vendorPhone:   z.string().optional(),
  vendorGst:     z.string().optional(),
  vendorAddress: z.string().optional(),

  lineItems: z.array(lineItemSchema).min(1, 'At least one charge is required'),

  freight:       z.coerce.number().min(0).optional().default(0),
  insurance:     z.coerce.number().min(0).optional().default(0),
  handling:      z.coerce.number().min(0).optional().default(0),
  otherCharges:  z.coerce.number().min(0).optional().default(0),

  reasonDetails: z.string().optional(),
  internalNotes: z.string().optional(),
});

const year = new Date().getFullYear();
const seq  = String(Date.now()).slice(-4);

export const debitNoteDefaults = {
  dnNumber:       `DN-${year}-${seq}`,
  dnDate:         new Date().toISOString().split('T')[0],
  originalPoNo:   '',
  originalPoDate: '',
  currency:       'INR',
  status:         'draft',
  taxType:        'cgst_sgst',
  debitReason:    '',

  vendorName: '', vendorContact: '', vendorEmail: '',
  vendorPhone: '', vendorGst: '', vendorAddress: '',

  lineItems: [{ itemCode: '', description: '', hsnCode: '', quantity: 1, unit: 'PCS', unitPrice: 0, discount: 0, taxPercentage: '18' }],

  freight: 0, insurance: 0, handling: 0, otherCharges: 0,
  reasonDetails: '', internalNotes: '',
};
