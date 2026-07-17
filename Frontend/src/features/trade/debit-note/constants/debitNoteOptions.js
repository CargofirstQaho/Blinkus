import { computeGstSummary, INDIAN_STATES } from '../../shared/utils/gstCalculator';

export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY', 'CNY', 'AUD', 'CAD'];
export { INDIAN_STATES };

export const UNITS = ['PCS', 'KG', 'MT', 'L', 'M', 'M²', 'M³', 'Box', 'Carton', 'Dozen', 'Pair', 'Set'];

export const DN_REASONS = [
  'Underbilling Correction',
  'Additional Charges',
  'Freight Adjustment',
  'Customs Adjustment',
  'Quantity Increase',
  'Price Revision',
  'Other',
];

export const DEFAULT_TERMS =
  'This debit note is issued against the referenced invoice and is subject to the original terms of sale. ' +
  'The additional amount is payable as per the agreed payment terms. ' +
  'This is a computer-generated document.';

export const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
export const GST_RE   = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
export const HSN_RE   = /^\d{4,8}$/;

export function computeDebitNoteTotals(lineItems, currency, placeOfSupply, orgGstNumber) {
  const { items, subTotal, cgst, sgst, igst } = computeGstSummary({
    items: lineItems,
    qtyField: 'quantity',
    priceField: 'rate',
    currency,
    placeOfSupply,
    orgGstNumber,
  });

  return { items, subtotal: subTotal, cgst, sgst, igst };
}
