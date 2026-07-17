import { screen } from '@testing-library/react';
import DocumentSummaryCard from './DocumentSummaryCard';
import { renderWithProviders } from '../../../../tests/utils';

describe('DocumentSummaryCard', () => {
  it('renders the document type, number, and status', () => {
    renderWithProviders(
      <DocumentSummaryCard
        documentType="Purchase Order"
        docNumber="PO-2026-0001"
        status="pending"
        itemCount={2}
        subtotal={100}
        totalTax={18}
        grandTotal={118}
      />,
    );

    expect(screen.getByText('Purchase Order')).toBeInTheDocument();
    expect(screen.getByText('PO-2026-0001')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByText('2 items')).toBeInTheDocument();
  });

  it('renders singular "item" label when itemCount is 1', () => {
    renderWithProviders(
      <DocumentSummaryCard documentType="Purchase Order" docNumber="PO-2026-0001" itemCount={1} />,
    );

    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('shows a warning when there are no line items', () => {
    renderWithProviders(
      <DocumentSummaryCard documentType="Purchase Order" docNumber="PO-2026-0001" itemCount={0} />,
    );

    expect(screen.getByText('Add at least one line item')).toBeInTheDocument();
  });

  it('falls back to draft status styling and "—" for a missing document number', () => {
    renderWithProviders(
      <DocumentSummaryCard documentType="Purchase Order" docNumber="" itemCount={1} />,
    );

    expect(screen.getByText('DRAFT')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders subtotal, tax, and grand total values', () => {
    renderWithProviders(
      <DocumentSummaryCard
        documentType="Purchase Order"
        docNumber="PO-2026-0001"
        itemCount={1}
        subtotal={100}
        totalTax={18}
        grandTotal={118}
      />,
    );

    expect(screen.getByText('100.00')).toBeInTheDocument();
    expect(screen.getByText('+ 18.00')).toBeInTheDocument();
    expect(screen.getByText('118.00')).toBeInTheDocument();
  });
});
