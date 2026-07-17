import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LockedFeatureScreen from './LockedFeatureScreen';
import { renderWithProviders } from '../../../../tests/utils';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LockedFeatureScreen', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('renders the module name and a default description', () => {
    renderWithProviders(<LockedFeatureScreen moduleName="Domestic" />);

    expect(screen.getByText('Domestic is a Trade subscriber feature')).toBeInTheDocument();
    expect(screen.getByText(/requires an active subscription/i)).toBeInTheDocument();
  });

  it('renders a custom description when provided', () => {
    renderWithProviders(<LockedFeatureScreen moduleName="International" description="Custom description text" />);

    expect(screen.getByText('International is a Trade subscriber feature')).toBeInTheDocument();
    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('navigates to the upgrade page when the CTA is clicked', async () => {
    renderWithProviders(<LockedFeatureScreen moduleName="Trade History" />);

    await userEvent.click(screen.getByRole('button', { name: /view subscription plans/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/trade/upgrade');
  });
});
