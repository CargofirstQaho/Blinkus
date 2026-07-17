import { screen } from '@testing-library/react';
import FormField from './FormField';
import { renderWithProviders } from '../../../../tests/utils';

describe('FormField', () => {
  it('renders the label and children', () => {
    renderWithProviders(
      <FormField label="PO Number">
        <input name="poNumber" />
      </FormField>,
    );

    expect(screen.getByText('PO Number')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a required marker when required is true', () => {
    renderWithProviders(
      <FormField label="PO Number" required>
        <input name="poNumber" />
      </FormField>,
    );

    expect(screen.getByText('PO Number').textContent).toContain('*');
  });

  it('renders the error message when an error is provided', () => {
    renderWithProviders(
      <FormField label="PO Number" error={{ message: 'PO Number is required' }}>
        <input name="poNumber" />
      </FormField>,
    );

    expect(screen.getByText('PO Number is required')).toBeInTheDocument();
  });

  it('does not render a label when none is provided', () => {
    const { container } = renderWithProviders(
      <FormField>
        <input name="poNumber" />
      </FormField>,
    );

    expect(container.querySelector('label')).not.toBeInTheDocument();
  });
});
