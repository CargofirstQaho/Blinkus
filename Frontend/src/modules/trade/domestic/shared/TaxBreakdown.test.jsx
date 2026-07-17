import { screen } from '@testing-library/react';
import TaxBreakdown from './TaxBreakdown';
import { renderWithProviders } from '../../../../tests/utils';

const baseProps = {
  subtotal: 200,
  cgst: 18,
  sgst: 18,
  igst: 36,
  totalTax: 36,
  grandTotal: 236,
};

describe('TaxBreakdown', () => {
  it('renders CGST and SGST rows when taxType is cgst_sgst', () => {
    renderWithProviders(<TaxBreakdown {...baseProps} taxType="cgst_sgst" />);

    expect(screen.getByText('CGST')).toBeInTheDocument();
    expect(screen.getByText('SGST')).toBeInTheDocument();
    expect(screen.queryByText('IGST')).not.toBeInTheDocument();
    expect(screen.getAllByText('+ 18.00')).toHaveLength(2);
  });

  it('renders an IGST row when taxType is igst', () => {
    renderWithProviders(<TaxBreakdown {...baseProps} taxType="igst" />);

    expect(screen.getByText('IGST')).toBeInTheDocument();
    expect(screen.queryByText('CGST')).not.toBeInTheDocument();
    expect(screen.getByText('+ 36.00')).toBeInTheDocument();
  });

  it('renders the subtotal and grand total', () => {
    renderWithProviders(<TaxBreakdown {...baseProps} taxType="cgst_sgst" />);

    expect(screen.getByText('Taxable Amount (Subtotal)')).toBeInTheDocument();
    expect(screen.getByText('200.00')).toBeInTheDocument();
    expect(screen.getByText('Grand Total')).toBeInTheDocument();
    expect(screen.getByText('236.00')).toBeInTheDocument();
  });

  it('renders other charges row when otherCharges is greater than 0', () => {
    renderWithProviders(<TaxBreakdown {...baseProps} taxType="igst" otherCharges={50} />);

    expect(screen.getByText('Other Charges / Freight')).toBeInTheDocument();
    expect(screen.getByText('+ 50.00')).toBeInTheDocument();
  });

  it('does not render other charges row when otherCharges is 0', () => {
    renderWithProviders(<TaxBreakdown {...baseProps} taxType="igst" otherCharges={0} />);

    expect(screen.queryByText('Other Charges / Freight')).not.toBeInTheDocument();
  });
});
