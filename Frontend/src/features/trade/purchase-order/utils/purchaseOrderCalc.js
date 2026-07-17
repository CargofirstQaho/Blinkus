export {
  getEffectiveQuantity,
  calcLineTotal,
  getConversionLabel,
  needsUnitsPerPackage,
} from '../../shared/utils/unitConversion.js';

export function currencySymbol(currency) {
  return currency === 'USD' ? '$' : '₹';
}

export function fmtAmount(amount, currency) {
  const sym = currencySymbol(currency);
  const val = (parseFloat(amount) || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sym} ${val}`;
}
