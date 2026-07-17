import { computeGstSummary, INDIAN_STATES } from '../../shared/utils/gstCalculator';

export const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'AED', 'SGD', 'JPY', 'CNY', 'AUD', 'CAD'];
export { INDIAN_STATES };

export const UNITS = ['PCS', 'KG', 'MT', 'L', 'M', 'M²', 'M³', 'Box', 'Carton', 'Dozen', 'Pair', 'Set'];

export const DEFAULT_DECLARATION =
  'We hereby declare that the information given above is true and correct to the best of our knowledge and belief, ' +
  'and that the goods described herein are of the origin stated and are exported in accordance with the terms of the ' +
  'underlying contract.';

export const DEFAULT_TERMS =
  'This Commercial Invoice is issued for customs clearance, banking and shipping purposes and reflects the actual ' +
  'value of the consignment described herein. Prices and terms are subject to the underlying contract. This is a ' +
  'computer-generated document';

export const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
export const HS_RE    = /^\d{4,8}$/;
export const IFSC_RE  = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const SWIFT_RE = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

export function computeCommercialTotals(goodsItems, financial, orgGstNumber) {
  const fin = financial || {};

  const items = (goodsItems || []).map((it) => {
    const qty       = parseFloat(it?.quantity)  || 0;
    const unitPrice = parseFloat(it?.unitPrice) || 0;
    const tax       = parseFloat(it?.taxPercent) || 0;
    const amount    = qty * unitPrice;
    return { ...it, amount, taxAmount: amount * (tax / 100) };
  });

  const subTotal = items.reduce((s, it) => s + it.amount, 0);

  const { cgst, sgst, igst } = computeGstSummary({
    items: goodsItems,
    qtyField: 'quantity',
    priceField: 'unitPrice',
    currency: fin.currency,
    placeOfSupply: fin.placeOfSupply,
    orgGstNumber,
  });

  const freight   = parseFloat(fin.freight)   || 0;
  const insurance = parseFloat(fin.insurance) || 0;
  const total     = subTotal + cgst + sgst + igst + freight + insurance;

  return { items, subTotal, cgst, sgst, igst, freight, insurance, total };
}
