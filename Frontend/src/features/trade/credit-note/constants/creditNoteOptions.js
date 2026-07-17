export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY', 'CNY', 'AUD', 'CAD'];

export const UNITS = ['PCS', 'KG', 'MT', 'L', 'M', 'M²', 'M³', 'Box', 'Carton', 'Dozen', 'Pair', 'Set'];

export const CN_REASONS = [
  'Goods Returned',
  'Overbilling Correction',
  'Discount Adjustment',
  'Export Shipment Correction',
  'Quantity Reduction',
  'Order Cancellation',
  'Other',
];

export const INDIAN_STATES = [
  { name: 'Jammu and Kashmir',           code: '01' },
  { name: 'Himachal Pradesh',            code: '02' },
  { name: 'Punjab',                      code: '03' },
  { name: 'Chandigarh',                  code: '04' },
  { name: 'Uttarakhand',                 code: '05' },
  { name: 'Haryana',                     code: '06' },
  { name: 'Delhi',                       code: '07' },
  { name: 'Rajasthan',                   code: '08' },
  { name: 'Uttar Pradesh',               code: '09' },
  { name: 'Bihar',                       code: '10' },
  { name: 'Sikkim',                      code: '11' },
  { name: 'Arunachal Pradesh',           code: '12' },
  { name: 'Nagaland',                    code: '13' },
  { name: 'Manipur',                     code: '14' },
  { name: 'Mizoram',                     code: '15' },
  { name: 'Tripura',                     code: '16' },
  { name: 'Meghalaya',                   code: '17' },
  { name: 'Assam',                       code: '18' },
  { name: 'West Bengal',                 code: '19' },
  { name: 'Jharkhand',                   code: '20' },
  { name: 'Odisha',                      code: '21' },
  { name: 'Chhattisgarh',                code: '22' },
  { name: 'Madhya Pradesh',              code: '23' },
  { name: 'Gujarat',                     code: '24' },
  { name: 'Daman and Diu',               code: '25' },
  { name: 'Dadra and Nagar Haveli',      code: '26' },
  { name: 'Maharashtra',                 code: '27' },
  { name: 'Andhra Pradesh (Old)',        code: '28' },
  { name: 'Karnataka',                   code: '29' },
  { name: 'Goa',                         code: '30' },
  { name: 'Lakshadweep',                 code: '31' },
  { name: 'Kerala',                      code: '32' },
  { name: 'Tamil Nadu',                  code: '33' },
  { name: 'Puducherry',                  code: '34' },
  { name: 'Andaman and Nicobar Islands', code: '35' },
  { name: 'Telangana',                   code: '36' },
  { name: 'Andhra Pradesh',              code: '37' },
  { name: 'Ladakh',                      code: '38' },
];

export const DEFAULT_TERMS =
  'This credit note is issued against the referenced invoice and is subject to the original terms of sale. ' +
  'The credit amount will be adjusted against future invoices or refunded as mutually agreed. ' +
  'This is a computer-generated document';

export const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
export const GST_RE   = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
export const HSN_RE   = /^\d{4,8}$/;

export function getStateCode(name) {
  const state = INDIAN_STATES.find((s) => s.name === name);
  return state ? state.code : null;
}

export function computeSupplyType(orgGstNumber, placeOfSupply) {
  const orgCode = (orgGstNumber || '').slice(0, 2);
  if (!orgCode) return 'INTRA';

  const placeCode = getStateCode(placeOfSupply);
  if (!placeCode) return 'INTRA';

  return orgCode === placeCode ? 'INTRA' : 'INTER';
}

export function computeCreditNoteTotals(lineItems, placeOfSupply, orgGstNumber) {
  const items = (lineItems || []).map((it) => {
    const qty   = parseFloat(it?.quantity)   || 0;
    const price = parseFloat(it?.unitPrice)  || 0;
    const tax   = parseFloat(it?.taxPercent) || 0;
    const base  = qty * price;
    const taxAmount = base * (tax / 100);
    return { ...it, taxAmount, total: base + taxAmount };
  });

  const subTotal = items.reduce((s, it) => s + (parseFloat(it.quantity) || 0) * (parseFloat(it.unitPrice) || 0), 0);
  const totalTax = items.reduce((s, it) => s + it.taxAmount, 0);

  const supplyType = computeSupplyType(orgGstNumber, placeOfSupply);

  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  if (supplyType === 'INTRA') {
    cgst = totalTax / 2;
    sgst = totalTax / 2;
  } else {
    igst = totalTax;
  }

  const total = subTotal + cgst + sgst + igst;

  return { items, subTotal, cgst, sgst, igst, total, supplyType };
}
