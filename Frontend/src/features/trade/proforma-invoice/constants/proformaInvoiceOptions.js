export const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'AED', 'SGD', 'JPY', 'CNY', 'AUD', 'CAD'];

export const UNITS = ['PCS', 'KG', 'MT', 'L', 'M', 'M²', 'M³', 'Box', 'Carton', 'Dozen', 'Pair', 'Set'];

export const DEFAULT_TERMS =
  'This Proforma Invoice is issued for the purpose of facilitating the import/export transaction and is subject to ' +
  'the terms agreed upon in the underlying contract. Prices, quantities and delivery schedules are subject to ' +
  'confirmation at the time of shipment. This is a computer-generated document.';

export const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
export const HS_RE    = /^\d{4,8}$/;
export const IFSC_RE  = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const SWIFT_RE = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

export function computeProformaTotals(commercialDetails) {
  const items = (commercialDetails || []).map((it) => {
    const qty  = parseFloat(it?.quantity) || 0;
    const rate = parseFloat(it?.rate)     || 0;
    return { ...it, amount: qty * rate };
  });

  const totalAmount = items.reduce((s, it) => s + it.amount, 0);

  return { items, totalAmount };
}
