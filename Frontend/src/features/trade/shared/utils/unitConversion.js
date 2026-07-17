import { PACKAGE_UNITS } from '../constants/tradeUnits.js';

export function needsUnitsPerPackage(unit) {
  return PACKAGE_UNITS.includes(unit);
}

export function getEffectiveQuantity(qty, unit, unitsPerPackage) {
  const q = parseFloat(qty) || 0;
  if (needsUnitsPerPackage(unit)) {
    const upp = parseFloat(unitsPerPackage);
    if (upp > 0) return q * upp;
  }
  return q;
}

export function calcLineTotal(qty, unit, unitPrice, unitsPerPackage) {
  return getEffectiveQuantity(qty, unit, unitsPerPackage) * (parseFloat(unitPrice) || 0);
}

export function getConversionLabel(qty, unit, unitsPerPackage) {
  const q = parseFloat(qty) || 0;
  if (!q) return null;
  if (needsUnitsPerPackage(unit)) {
    const upp = parseFloat(unitsPerPackage);
    if (upp > 0) return `${q} ${unit} = ${q * upp} PCS`;
  }
  return null;
}
