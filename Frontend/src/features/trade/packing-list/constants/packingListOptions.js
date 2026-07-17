export const PACKAGING_TYPES = ['Carton', 'Pallet', 'Drum', 'Bag', 'Crate', 'Box', 'Bale', 'Roll', 'Bundle', 'Case'];

export const UNITS = ['PCS', 'KG', 'MT', 'L', 'M', 'M²', 'M³', 'Box', 'Carton', 'Dozen', 'Pair', 'Set'];

export const DEFAULT_TERMS =
  'This Packing List is issued for customs clearance and shipping purposes and reflects the actual packing details ' +
  'of the consignment described herein. Weights and measurements are approximate and subject to standard trade ' +
  'tolerances. This is a computer-generated document.';

export const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
export const HS_RE    = /^\d{4,8}$/;

export function computePackingTotals(packingItems) {
  const items = packingItems || [];

  return items.reduce(
    (totals, it) => {
      totals.totalNumberOfPackages += parseFloat(it?.numberOfPackages) || 0;
      totals.totalNetWeight        += parseFloat(it?.netWeight) || 0;
      totals.totalGrossWeight      += parseFloat(it?.grossWeight) || 0;
      totals.totalQuantity         += parseFloat(it?.quantity) || 0;
      return totals;
    },
    { totalNumberOfPackages: 0, totalNetWeight: 0, totalGrossWeight: 0, totalQuantity: 0 }
  );
}
