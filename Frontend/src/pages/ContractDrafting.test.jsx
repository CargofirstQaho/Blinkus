import { screen } from '@testing-library/react';
import { renderWithProviders } from '../tests/utils';

jest.mock('../components/dashboard/contract-drafting/ContractDrafting', () => {
  return function MockContractDrafting() {
    return (
      <div data-testid="contract-drafting-content">
        <h1>Contract Drafting</h1>
        <p>AI-assisted international trade agreements</p>
      </div>
    );
  };
});

const ContractDrafting = require('./ContractDrafting').default;

describe('ContractDrafting Page', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ContractDrafting />);
    expect(screen.getByTestId('contract-drafting-content')).toBeInTheDocument();
  });

  it('renders contract drafting content heading', () => {
    renderWithProviders(<ContractDrafting />);
    expect(screen.getByText('Contract Drafting')).toBeInTheDocument();
  });
});
