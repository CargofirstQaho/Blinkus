import { computeLineTotal, computeTotals, fmtNum } from './utils';

describe('computeLineTotal', () => {
  it('computes quantity * unitPrice with no discount', () => {
    expect(computeLineTotal(2, 100, 0)).toBe(200);
  });

  it('applies a percentage discount', () => {
    expect(computeLineTotal(2, 100, 10)).toBe(180);
  });

  it('clamps discount to a maximum of 100', () => {
    expect(computeLineTotal(2, 100, 150)).toBe(0);
  });

  it('clamps negative discount to 0', () => {
    expect(computeLineTotal(2, 100, -10)).toBe(200);
  });

  it('treats non-numeric inputs as 0', () => {
    expect(computeLineTotal('abc', 100, 0)).toBe(0);
    expect(computeLineTotal(2, 'abc', 0)).toBe(0);
    expect(computeLineTotal(2, 100, 'abc')).toBe(200);
  });
});

describe('computeTotals', () => {
  it('returns all zeros for an empty line item list', () => {
    expect(computeTotals([], 0)).toEqual({
      subtotal: 0,
      totalTax: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      grandTotal: 0,
    });
  });

  it('computes subtotal, tax, and grand total for a single item', () => {
    const lineItems = [{ quantity: 2, unitPrice: 100, discount: 0, taxPercentage: '18' }];
    const totals = computeTotals(lineItems, 0);

    expect(totals.subtotal).toBe(200);
    expect(totals.totalTax).toBeCloseTo(36);
    expect(totals.cgst).toBeCloseTo(18);
    expect(totals.sgst).toBeCloseTo(18);
    expect(totals.igst).toBeCloseTo(36);
    expect(totals.grandTotal).toBeCloseTo(236);
  });

  it('sums multiple line items and includes other charges in the grand total', () => {
    const lineItems = [
      { quantity: 1, unitPrice: 100, discount: 0, taxPercentage: '18' },
      { quantity: 1, unitPrice: 50, discount: 10, taxPercentage: '12' },
    ];
    const totals = computeTotals(lineItems, 25);

    const expectedSubtotal = 100 + 45;
    const expectedTax = 100 * 0.18 + 45 * 0.12;

    expect(totals.subtotal).toBeCloseTo(expectedSubtotal);
    expect(totals.totalTax).toBeCloseTo(expectedTax);
    expect(totals.grandTotal).toBeCloseTo(expectedSubtotal + expectedTax + 25);
  });
});

describe('fmtNum', () => {
  it('formats numbers to two decimal places', () => {
    expect(fmtNum(10)).toBe('10.00');
    expect(fmtNum(10.456)).toBe('10.46');
  });

  it('returns 0.00 for non-numeric input', () => {
    expect(fmtNum('abc')).toBe('0.00');
    expect(fmtNum(undefined)).toBe('0.00');
  });
});
