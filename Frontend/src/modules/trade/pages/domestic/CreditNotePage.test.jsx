import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreditNotePage from './CreditNotePage';
import { renderWithProviders } from '../../../../tests/utils';

describe('CreditNotePage', () => {
  it('renders the page header and all form sections', () => {
    renderWithProviders(<CreditNotePage />);

    expect(screen.getByRole('heading', { name: 'Credit Note' })).toBeInTheDocument();
    expect(screen.getByText('Issue a credit note against a previous invoice')).toBeInTheDocument();
    expect(screen.getByText('Credit Note Information')).toBeInTheDocument();
    expect(screen.getByText('Customer Details')).toBeInTheDocument();
    expect(screen.getAllByText('Line Items').length).toBeGreaterThan(0);
    expect(screen.getByText('Credit Adjustments & Tax')).toBeInTheDocument();
    expect(screen.getByText('Reason & Internal Notes')).toBeInTheDocument();
  });

  it('renders default field values', () => {
    const { container } = renderWithProviders(<CreditNotePage />);

    expect(screen.getByDisplayValue(/^CN-\d{4}-\d+$/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('INR')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Draft')).toBeInTheDocument();
    expect(container.querySelector('input[name="customerName"]')).toHaveValue('');
  });

  it('shows validation errors for required fields on submit', async () => {
    const { container } = renderWithProviders(<CreditNotePage />);

    const cnNumberInput = container.querySelector('input[name="cnNumber"]');
    await userEvent.clear(cnNumberInput);

    await userEvent.click(screen.getByRole('button', { name: /save & generate/i }));

    expect(await screen.findByText('Credit Note Number is required')).toBeInTheDocument();
    expect(await screen.findByText('Customer name is required')).toBeInTheDocument();
  });

  it('switches the tax mode to IGST', async () => {
    renderWithProviders(<CreditNotePage />);

    expect(screen.getByText('CGST')).toBeInTheDocument();
    expect(screen.getByText('SGST')).toBeInTheDocument();

    const igstRadio = screen.getByRole('radio', { name: /igst \(interstate\)/i });
    await userEvent.click(igstRadio);

    expect(igstRadio).toBeChecked();
    expect(screen.getByText('IGST')).toBeInTheDocument();
  });

  it('adds a new line item row', async () => {
    renderWithProviders(<CreditNotePage />);

    expect(screen.getAllByText('1 item').length).toBeGreaterThan(0);

    await userEvent.click(screen.getByRole('button', { name: /add row/i }));

    expect(screen.getAllByText('2 items').length).toBeGreaterThan(0);
    expect(screen.queryByText('1 item')).not.toBeInTheDocument();
  });
});
