import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubscriptionStatusCard from './SubscriptionStatusCard';
import { renderWithProviders } from '../../../../tests/utils';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const noActiveTrade = {
  planType: 'none',
  status: 'none',
  startDate: null,
  endDate: null,
  unlimitedAccess: false,
};

const activeTrade = {
  planType: 'yearly',
  status: 'active',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  unlimitedAccess: true,
};

const monthlyActiveTrade = {
  planType: 'monthly',
  status: 'active',
  startDate: '2026-06-01',
  endDate: '2026-07-01',
  unlimitedAccess: true,
};

describe('SubscriptionStatusCard', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  describe('Inactive / no plan state', () => {
    it('shows "Trade ERP" when there is no active plan', () => {
      renderWithProviders(<SubscriptionStatusCard trade={noActiveTrade} />);
      expect(screen.getByText('Trade ERP')).toBeInTheDocument();
    });

    it('shows subscribe prompt when not active', () => {
      renderWithProviders(<SubscriptionStatusCard trade={noActiveTrade} />);
      expect(screen.getByText('Subscribe to unlock full ERP access')).toBeInTheDocument();
    });

    it('shows Upgrade button when not active', () => {
      renderWithProviders(<SubscriptionStatusCard trade={noActiveTrade} />);
      expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument();
    });

    it('does not show plan label like "Yearly Plan" when not active', () => {
      renderWithProviders(<SubscriptionStatusCard trade={noActiveTrade} />);
      expect(screen.queryByText('Yearly Plan')).not.toBeInTheDocument();
    });

    it('shows Upgrade button when trade is undefined', () => {
      renderWithProviders(<SubscriptionStatusCard trade={undefined} />);
      expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument();
    });

    it('treats active status with unlimitedAccess=false as inactive', () => {
      renderWithProviders(<SubscriptionStatusCard trade={{ ...activeTrade, unlimitedAccess: false }} />);
      expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument();
    });
  });

  describe('Active plan state', () => {
    it('shows Yearly Plan label for yearly plan', () => {
      renderWithProviders(<SubscriptionStatusCard trade={activeTrade} />);
      expect(screen.getByText('Yearly Plan')).toBeInTheDocument();
    });

    it('shows Monthly Plan label for monthly plan', () => {
      renderWithProviders(<SubscriptionStatusCard trade={monthlyActiveTrade} />);
      expect(screen.getByText('Monthly Plan')).toBeInTheDocument();
    });

    it('shows expiry date line when active', () => {
      renderWithProviders(<SubscriptionStatusCard trade={activeTrade} />);
      expect(screen.getByText(/renews \/ expires on/i)).toBeInTheDocument();
    });

    it('shows Manage button when active', () => {
      renderWithProviders(<SubscriptionStatusCard trade={activeTrade} />);
      expect(screen.getByRole('button', { name: /manage/i })).toBeInTheDocument();
    });

    it('does not show Upgrade button when active', () => {
      renderWithProviders(<SubscriptionStatusCard trade={activeTrade} />);
      expect(screen.queryByRole('button', { name: /upgrade/i })).not.toBeInTheDocument();
    });

    it('does not show subscribe prompt when active', () => {
      renderWithProviders(<SubscriptionStatusCard trade={activeTrade} />);
      expect(screen.queryByText('Subscribe to unlock full ERP access')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('clicking Upgrade navigates to /trade/upgrade', async () => {
      renderWithProviders(<SubscriptionStatusCard trade={noActiveTrade} />);
      await userEvent.click(screen.getByRole('button', { name: /upgrade/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/trade/upgrade');
    });

    it('clicking Manage navigates to /trade/upgrade', async () => {
      renderWithProviders(<SubscriptionStatusCard trade={activeTrade} />);
      await userEvent.click(screen.getByRole('button', { name: /manage/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/trade/upgrade');
    });
  });

  describe('Compact mode', () => {
    it('renders without crashing in compact mode', () => {
      renderWithProviders(<SubscriptionStatusCard trade={activeTrade} compact />);
      expect(screen.getByText('Yearly Plan')).toBeInTheDocument();
    });
  });
});
