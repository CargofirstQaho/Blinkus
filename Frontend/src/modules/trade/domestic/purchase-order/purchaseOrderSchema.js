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

export const purchaseOrderSchema = z.object({
  poNumber:        z.string().min(1, 'PO Number is required'),
  poDate:          z.string().min(1, 'Date is required'),
  deliveryDate:    z.string().optional(),
  referenceNumber: z.string().optional(),
  currency:        z.string().min(1, 'Currency is required'),
  incoterm:        z.string().optional(),
  status:          z.string().min(1),
  taxType:         z.enum(['cgst_sgst', 'igst']).default('cgst_sgst'),

  buyerName:        z.string().min(1, 'Buyer name is required'),
  buyerContact:     z.string().optional(),
  buyerEmail:       z.string().optional(),
  buyerPhone:       z.string().optional(),
  buyerGst:         z.string().optional(),
  buyerAddress:     z.string().optional(),
  buyerCity:        z.string().optional(),
  buyerState:       z.string().optional(),
  buyerCountry:     z.string().optional(),
  buyerPostalCode:  z.string().optional(),

  supplierName:        z.string().min(1, 'Supplier name is required'),
  supplierContact:     z.string().optional(),
  supplierEmail:       z.string().optional(),
  supplierPhone:       z.string().optional(),
  supplierGst:         z.string().optional(),
  supplierAddress:     z.string().optional(),
  supplierCity:        z.string().optional(),
  supplierState:       z.string().optional(),
  supplierCountry:     z.string().optional(),
  supplierPostalCode:  z.string().optional(),

  deliveryLocation:   z.string().optional(),
  deliveryContact:    z.string().optional(),
  shippingMethod:     z.string().optional(),
  transporterName:    z.string().optional(),
  transportReference: z.string().optional(),

  lineItems: z.array(lineItemSchema).min(1, 'At least one item is required'),

  otherCharges:    z.coerce.number().min(0).optional().default(0),
  paymentTerms:    z.string().optional(),
  deliveryTerms:   z.string().optional(),
  inspectionTerms: z.string().optional(),
  warrantyTerms:   z.string().optional(),

  remarks:             z.string().optional(),
  specialInstructions: z.string().optional(),
});

const year = new Date().getFullYear();
const seq  = String(Date.now()).slice(-4);

export const purchaseOrderDefaults = {
  poNumber:        `PO-${year}-${seq}`,
  poDate:          new Date().toISOString().split('T')[0],
  deliveryDate:    '',
  referenceNumber: '',
  currency:        'INR',
  incoterm:        '',
  status:          'draft',
  taxType:         'cgst_sgst',

  buyerName: '', buyerContact: '', buyerEmail: '', buyerPhone: '', buyerGst: '',
  buyerAddress: '', buyerCity: '', buyerState: '', buyerCountry: 'India', buyerPostalCode: '',

  supplierName: '', supplierContact: '', supplierEmail: '', supplierPhone: '', supplierGst: '',
  supplierAddress: '', supplierCity: '', supplierState: '', supplierCountry: 'India', supplierPostalCode: '',

  deliveryLocation: '', deliveryContact: '', shippingMethod: '', transporterName: '', transportReference: '',

  lineItems: [{ itemCode: '', description: '', hsnCode: '', quantity: 1, unit: 'PCS', unitPrice: 0, discount: 0, taxPercentage: '18' }],

  otherCharges: 0,
  paymentTerms: '', deliveryTerms: '', inspectionTerms: '', warrantyTerms: '',
  remarks: '', specialInstructions: '',
};
