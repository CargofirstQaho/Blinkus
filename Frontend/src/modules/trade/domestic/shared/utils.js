export function computeLineTotal(qty, unitPrice, discount) {
  const q = parseFloat(qty) || 0;
  const p = parseFloat(unitPrice) || 0;
  const d = Math.min(Math.max(parseFloat(discount) || 0, 0), 100);
  return q * p * (1 - d / 100);
}

export function computeTotals(lineItems = [], otherCharges = 0) {
  const subtotal = lineItems.reduce(
    (sum, it) => sum + computeLineTotal(it.quantity, it.unitPrice, it.discount),
    0,
  );
  const totalTax = lineItems.reduce((sum, it) => {
    const rate = parseFloat(it.taxPercentage) || 0;
    return sum + computeLineTotal(it.quantity, it.unitPrice, it.discount) * (rate / 100);
  }, 0);
  const other = parseFloat(otherCharges) || 0;
  return {
    subtotal,
    totalTax,
    cgst: totalTax / 2,
    sgst: totalTax / 2,
    igst: totalTax,
    grandTotal: subtotal + totalTax + other,
  };
}

export function fmtNum(n) {
  return (parseFloat(n) || 0).toFixed(2);
}
