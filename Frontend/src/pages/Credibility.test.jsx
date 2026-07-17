import { screen } from '@testing-library/react';
import { renderWithProviders } from '../tests/utils';

// Mock all heavy sub-components to keep tests focused and fast
jest.mock('../components/dashboard/credibility/Credibility', () => {
  return function MockCredibility() {
    return (
      <div data-testid="credibility-content">
        <h1>Credibility Intelligence</h1>
        <p>Buyer and seller verification</p>
      </div>
    );
  };
});

// Dynamic import to force re-evaluation after mock
const Credibility = require('./Credibility').default;

describe('Credibility Page', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Credibility />);
    expect(screen.getByTestId('credibility-content')).toBeInTheDocument();
  });

  it('renders credibility content heading', () => {
    renderWithProviders(<Credibility />);
    expect(screen.getByText('Credibility Intelligence')).toBeInTheDocument();
  });
});
