import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import LineItemsTable from './LineItemsTable';
import { renderWithProviders } from '../../../../tests/utils';

const defaultLineItem = { itemCode: '', description: '', hsnCode: '', quantity: 1, unit: 'PCS', unitPrice: 0, discount: 0, taxPercentage: '18' };

function Harness({ mode, errors = {}, lineItems = [defaultLineItem] }) {
  const { register, control, watch } = useForm({ defaultValues: { lineItems } });
  return <LineItemsTable control={control} register={register} errors={errors} watch={watch} mode={mode} />;
}

describe('LineItemsTable', () => {
  it('renders the header with item count and Add Row button', () => {
    renderWithProviders(<Harness />);

    expect(screen.getByText('Line Items')).toBeInTheDocument();
    expect(screen.getByText('1 item')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add row/i })).toBeInTheDocument();
  });

  it('shows Item Code column and Disc % column for purchase order mode', () => {
    const { container } = renderWithProviders(<Harness mode="po" />);

    const thead = container.querySelector('thead');
    expect(within(thead).getByText('Item Code')).toBeInTheDocument();
    expect(within(thead).getByText('Disc %')).toBeInTheDocument();
    expect(within(thead).getByText('Unit Price *')).toBeInTheDocument();
  });

  it('hides the Item Code column for credit note mode', () => {
    const { container } = renderWithProviders(<Harness mode="cn" />);

    const thead = container.querySelector('thead');
    expect(within(thead).queryByText('Item Code')).not.toBeInTheDocument();
    expect(within(thead).queryByText('Charge Type')).not.toBeInTheDocument();
    expect(within(thead).getByText('Disc %')).toBeInTheDocument();
  });

  it('shows Charge Type and Rate columns and hides Disc % for debit note mode', () => {
    const { container } = renderWithProviders(<Harness mode="dn" />);

    const thead = container.querySelector('thead');
    expect(within(thead).getByText('Charge Type')).toBeInTheDocument();
    expect(within(thead).getByText('Rate *')).toBeInTheDocument();
    expect(within(thead).queryByText('Disc %')).not.toBeInTheDocument();
  });

  it('adds a new row when Add Row is clicked', async () => {
    renderWithProviders(<Harness />);

    expect(screen.getByText('1 item')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /add row/i }));

    expect(screen.getByText('2 items')).toBeInTheDocument();
    expect(screen.queryByText('1 item')).not.toBeInTheDocument();
  });

  it('renders a line items validation message when provided', () => {
    renderWithProviders(<Harness errors={{ lineItems: { message: 'At least one item is required' } }} />);

    expect(screen.getByText('At least one item is required')).toBeInTheDocument();
  });
});
