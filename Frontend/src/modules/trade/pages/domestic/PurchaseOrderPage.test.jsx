import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PurchaseOrderPage from './PurchaseOrderPage';
import { renderWithProviders } from '../../../../tests/utils';

describe('PurchaseOrderPage', () => {
  it('renders the page header and all form sections', () => {
    renderWithProviders(<PurchaseOrderPage />);

    expect(screen.getByRole('heading', { name: 'Purchase Order' })).toBeInTheDocument();
    expect(screen.getByText('Create a new domestic purchase order')).toBeInTheDocument();
    expect(screen.getByText('Document Information')).toBeInTheDocument();
    expect(screen.getByText('Buyer Information')).toBeInTheDocument();
    expect(screen.getByText('Supplier Information')).toBeInTheDocument();
    expect(screen.getByText('Shipping & Delivery')).toBeInTheDocument();
    expect(screen.getAllByText('Line Items').length).toBeGreaterThan(0);
    expect(screen.getByText('Tax & Totals')).toBeInTheDocument();
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
    expect(screen.getByText('Notes & Instructions')).toBeInTheDocument();
  });

  it('renders default field values', () => {
    const { container } = renderWithProviders(<PurchaseOrderPage />);

    expect(screen.getByDisplayValue(/^PO-\d{4}-\d+$/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('INR')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Draft')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('India').length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector('input[name="buyerName"]')).toHaveValue('');
    expect(container.querySelector('input[name="supplierName"]')).toHaveValue('');
  });

  it('shows validation errors for required fields on submit', async () => {
    const { container } = renderWithProviders(<PurchaseOrderPage />);

    const poNumberInput = container.querySelector('input[name="poNumber"]');
    await userEvent.clear(poNumberInput);

    await userEvent.click(screen.getByRole('button', { name: /save & generate/i }));

    expect(await screen.findByText('PO Number is required')).toBeInTheDocument();
    expect(await screen.findByText('Buyer name is required')).toBeInTheDocument();
    expect(await screen.findByText('Supplier name is required')).toBeInTheDocument();
  });

  it('switches the tax mode to IGST', async () => {
    renderWithProviders(<PurchaseOrderPage />);

    expect(screen.getByText('CGST')).toBeInTheDocument();
    expect(screen.getByText('SGST')).toBeInTheDocument();

    const igstRadio = screen.getByRole('radio', { name: /igst \(interstate\)/i });
    await userEvent.click(igstRadio);

    expect(igstRadio).toBeChecked();
    expect(screen.getByText('IGST')).toBeInTheDocument();
  });

  it('adds a new line item row', async () => {
    renderWithProviders(<PurchaseOrderPage />);

    expect(screen.getAllByText('1 item').length).toBeGreaterThan(0);

    await userEvent.click(screen.getByRole('button', { name: /add row/i }));

    expect(screen.getAllByText('2 items').length).toBeGreaterThan(0);
    expect(screen.queryByText('1 item')).not.toBeInTheDocument();
  });
});
