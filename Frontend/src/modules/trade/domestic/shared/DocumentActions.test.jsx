import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DocumentActions from './DocumentActions';
import { renderWithProviders } from '../../../../tests/utils';

describe('DocumentActions', () => {
  it('renders the document type and draft status by default', () => {
    renderWithProviders(<DocumentActions documentType="Purchase Order" onSaveAsDraft={jest.fn()} />);

    expect(screen.getByText('New Purchase Order')).toBeInTheDocument();
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
  });

  it('renders the status badge for a given status', () => {
    renderWithProviders(<DocumentActions documentType="Purchase Order" status="approved" onSaveAsDraft={jest.fn()} />);

    expect(screen.getByText('APPROVED')).toBeInTheDocument();
  });

  it('calls onSaveAsDraft when the Save Draft button is clicked', async () => {
    const onSaveAsDraft = jest.fn();
    renderWithProviders(<DocumentActions documentType="Purchase Order" onSaveAsDraft={onSaveAsDraft} />);

    await userEvent.click(screen.getByRole('button', { name: /save draft/i }));

    expect(onSaveAsDraft).toHaveBeenCalledTimes(1);
  });

  it('renders a submit button labeled Save & Generate', () => {
    renderWithProviders(<DocumentActions documentType="Purchase Order" onSaveAsDraft={jest.fn()} />);

    const submitButton = screen.getByRole('button', { name: /save & generate/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});
