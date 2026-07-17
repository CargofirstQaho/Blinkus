import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DebitNotePage from './DebitNotePage';
import { renderWithProviders } from '../../../../tests/utils';

describe('DebitNotePage', () => {
  it('renders the page header and all form sections', () => {
    renderWithProviders(<DebitNotePage />);

    expect(screen.getByRole('heading', { name: 'Debit Note' })).toBeInTheDocument();
    expect(screen.getByText('Raise a debit note for additional charges or corrections')).toBeInTheDocument();
    expect(screen.getByText('Debit Note Information')).toBeInTheDocument();
    expect(screen.getByText('Vendor Details')).toBeInTheDocument();
    expect(screen.getAllByText('Line Items').length).toBeGreaterThan(0);
    expect(screen.getByText('Additional Charges & Tax')).toBeInTheDocument();
    expect(screen.getByText('Reason & Internal Notes')).toBeInTheDocument();
  });

  it('renders default field values', () => {
    const { container } = renderWithProviders(<DebitNotePage />);

    expect(screen.getByDisplayValue(/^DN-\d{4}-\d+$/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('INR')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Draft')).toBeInTheDocument();
    expect(container.querySelector('input[name="vendorName"]')).toHaveValue('');
  });

  it('shows validation errors for required fields on submit', async () => {
    const { container } = renderWithProviders(<DebitNotePage />);

    const dnNumberInput = container.querySelector('input[name="dnNumber"]');
    await userEvent.clear(dnNumberInput);

    await userEvent.click(screen.getByRole('button', { name: /save & generate/i }));

    expect(await screen.findByText('Debit Note Number is required')).toBeInTheDocument();
    expect(await screen.findByText('Vendor name is required')).toBeInTheDocument();
  });

  it('switches the tax mode to IGST', async () => {
    renderWithProviders(<DebitNotePage />);

    expect(screen.getByText('CGST')).toBeInTheDocument();
    expect(screen.getByText('SGST')).toBeInTheDocument();

    const igstRadio = screen.getByRole('radio', { name: /igst \(interstate\)/i });
    await userEvent.click(igstRadio);

    expect(igstRadio).toBeChecked();
    expect(screen.getByText('IGST')).toBeInTheDocument();
  });

  it('adds a new line item row', async () => {
    renderWithProviders(<DebitNotePage />);

    expect(screen.getAllByText('1 item').length).toBeGreaterThan(0);

    await userEvent.click(screen.getByRole('button', { name: /add row/i }));

    expect(screen.getAllByText('2 items').length).toBeGreaterThan(0);
    expect(screen.queryByText('1 item')).not.toBeInTheDocument();
  });
});
