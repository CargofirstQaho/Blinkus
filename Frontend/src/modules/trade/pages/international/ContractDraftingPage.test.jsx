import { screen } from '@testing-library/react';
import ContractDraftingPage from './ContractDraftingPage';
import { renderWithProviders } from '../../../../tests/utils';

describe('ContractDraftingPage', () => {
  it('renders the page header with title, badge, and description', () => {
    renderWithProviders(<ContractDraftingPage />);

    expect(screen.getByRole('heading', { name: 'Contract Drafting' })).toBeInTheDocument();
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText(/Generate, negotiate, and execute international trade contracts/)).toBeInTheDocument();
  });

  it('renders the key features section', () => {
    renderWithProviders(<ContractDraftingPage />);

    expect(screen.getByText('Key Features')).toBeInTheDocument();
    expect(screen.getByText('Contract Generation')).toBeInTheDocument();
    expect(screen.getByText('Clause Management')).toBeInTheDocument();
    expect(screen.getByText('Buyer & Seller Terms')).toBeInTheDocument();
    expect(screen.getByText('Digital Signature')).toBeInTheDocument();
    expect(screen.getByText('Compliance Checks')).toBeInTheDocument();
    expect(screen.getByText('Multi-Currency Terms')).toBeInTheDocument();
  });

  it('renders the workflow preview section', () => {
    renderWithProviders(<ContractDraftingPage />);

    expect(screen.getByText('Workflow Preview')).toBeInTheDocument();
    expect(screen.getByText('Select Template')).toBeInTheDocument();
    expect(screen.getByText('Configure Clauses')).toBeInTheDocument();
    expect(screen.getByText('Send for Review')).toBeInTheDocument();
    expect(screen.getByText('Sign & Execute')).toBeInTheDocument();
  });

  it('renders the future automation section', () => {
    renderWithProviders(<ContractDraftingPage />);

    expect(screen.getByText('Future Automation')).toBeInTheDocument();
    expect(screen.getByText('AI clause suggestion engine')).toBeInTheDocument();
    expect(screen.getByText('Automatic Incoterm risk allocation')).toBeInTheDocument();
    expect(screen.getByText('Export regulation auto-check')).toBeInTheDocument();
  });
});
