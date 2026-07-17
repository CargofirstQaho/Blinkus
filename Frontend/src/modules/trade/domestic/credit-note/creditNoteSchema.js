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

export const creditNoteSchema = z.object({
  cnNumber:            z.string().min(1, 'Credit Note Number is required'),
  cnDate:              z.string().min(1, 'Date is required'),
  originalInvoiceNo:   z.string().optional(),
  originalInvoiceDate: z.string().optional(),
  currency:            z.string().min(1),
  status:              z.string().min(1),
  taxType:             z.enum(['cgst_sgst', 'igst']).default('cgst_sgst'),
  creditReason:        z.string().optional(),

  customerName:    z.string().min(1, 'Customer name is required'),
  customerContact: z.string().optional(),
  customerEmail:   z.string().optional(),
  customerPhone:   z.string().optional(),
  customerGst:     z.string().optional(),
  customerAddress: z.string().optional(),

  lineItems: z.array(lineItemSchema).min(1, 'At least one item is required'),

  restockingFee:      z.coerce.number().min(0).optional().default(0),
  handlingCharges:    z.coerce.number().min(0).optional().default(0),
  otherAdjustments:   z.coerce.number().optional().default(0),

  reasonDetails: z.string().optional(),
  internalNotes: z.string().optional(),
});

const year = new Date().getFullYear();
const seq  = String(Date.now()).slice(-4);

export const creditNoteDefaults = {
  cnNumber:            `CN-${year}-${seq}`,
  cnDate:              new Date().toISOString().split('T')[0],
  originalInvoiceNo:   '',
  originalInvoiceDate: '',
  currency:            'INR',
  status:              'draft',
  taxType:             'cgst_sgst',
  creditReason:        '',

  customerName: '', customerContact: '', customerEmail: '',
  customerPhone: '', customerGst: '', customerAddress: '',

  lineItems: [{ itemCode: '', description: '', hsnCode: '', quantity: 1, unit: 'PCS', unitPrice: 0, discount: 0, taxPercentage: '18' }],

  restockingFee: 0, handlingCharges: 0, otherAdjustments: 0,
  reasonDetails: '', internalNotes: '',
};
