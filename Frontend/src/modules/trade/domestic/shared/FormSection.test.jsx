import { screen } from '@testing-library/react';
import { Hash } from 'lucide-react';
import FormSection from './FormSection';
import { renderWithProviders } from '../../../../tests/utils';

describe('FormSection', () => {
  it('renders the title and children', () => {
    renderWithProviders(
      <FormSection title="Document Information">
        <p>Section content</p>
      </FormSection>,
    );

    expect(screen.getByRole('heading', { name: 'Document Information' })).toBeInTheDocument();
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('renders the icon when provided', () => {
    const { container } = renderWithProviders(
      <FormSection title="Document Information" icon={Hash}>
        <p>Section content</p>
      </FormSection>,
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not render an icon when none is provided', () => {
    const { container } = renderWithProviders(
      <FormSection title="Document Information">
        <p>Section content</p>
      </FormSection>,
    );

    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
