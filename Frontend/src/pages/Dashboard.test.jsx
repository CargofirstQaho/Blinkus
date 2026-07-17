import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from './Dashboard';
import { renderWithProviders, authenticatedState } from '../tests/utils';

jest.mock('../lib/apiFetch', () => ({
  apiFetch: jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ data: { conversations: [] } }),
  }),
  SessionExpiredError: class SessionExpiredError extends Error {
    constructor() { super('session_expired'); this.name = 'SessionExpiredError'; }
  },
}));

// Do NOT mock chatHistorySlice here — mocking it breaks the chatHistoryReducer default-export
// import in tests/utils.jsx which causes state.chatHistory to be undefined.
// All preloadedStates below use status:'succeeded' or status:'loading', so the real thunk's
// condition guard prevents any API calls from running.

jest.mock('../components/dashboard/subscriptions/hooks/useEntitlements', () => ({
  useEntitlements: jest.fn().mockReturnValue({
    trade: null,
    canAccessErp: false,
    canAccessChat: true,
    featureFlags: {},
    loaded: true,
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const emptyConvState = {
  ...authenticatedState,
  chatHistory: { conversations: [], status: 'succeeded', error: null },
};

const withConversations = {
  ...authenticatedState,
  chatHistory: {
    conversations: [
      { _id: 'c1', title: 'Trade talk', lastMessage: 'What is HS code?' },
      { _id: 'c2', title: 'Coffee prices', lastMessage: 'Latest Arabica prices' },
    ],
    status: 'succeeded',
    error: null,
  },
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  describe('Rendering', () => {
    it('renders without crashing', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: emptyConvState });
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });
    });

    it('renders the hero banner section', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: emptyConvState });
      await waitFor(() => {
        expect(screen.getByText(/The Intelligence Engine/i)).toBeInTheDocument();
      });
    });

    it('renders Quick Actions section heading', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: emptyConvState });
      await waitFor(() => {
        expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      });
    });

    it('renders Recent Chats section heading', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: emptyConvState });
      await waitFor(() => {
        expect(screen.getByText('Recent Chats')).toBeInTheDocument();
      });
    });

    it('renders New Chat button in quick actions header', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: emptyConvState });
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new chat/i })).toBeInTheDocument();
      });
    });
  });

  describe('Quick Action cards', () => {
    it('renders all four quick action buttons', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: emptyConvState });
      await waitFor(() => {
        expect(screen.getByText('Ask Trade Agent')).toBeInTheDocument();
        expect(screen.getByText('Market Analysis')).toBeInTheDocument();
        expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
        expect(screen.getByText('HS Code Lookup')).toBeInTheDocument();
      });
    });

    it('renders quick action descriptions', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: emptyConvState });
      await waitFor(() => {
        expect(screen.getByText('Get AI-powered trade insights')).toBeInTheDocument();
        expect(screen.getByText('Analyze commodity benchmarks')).toBeInTheDocument();
      });
    });

    it('clicking Ask Trade Agent navigates to /chat/new', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: emptyConvState });
      await waitFor(() => screen.getByText('Ask Trade Agent'));
      await userEvent.click(screen.getByText('Ask Trade Agent'));
      expect(mockNavigate).toHaveBeenCalledWith('/chat/new');
    });

    it('clicking Market Analysis navigates to /chat/new', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: emptyConvState });
      await waitFor(() => screen.getByText('Market Analysis'));
      await userEvent.click(screen.getByText('Market Analysis'));
      expect(mockNavigate).toHaveBeenCalledWith('/chat/new');
    });

    it('clicking New Chat button navigates to /chat/new', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: emptyConvState });
      await waitFor(() => screen.getByRole('button', { name: /new chat/i }));
      await userEvent.click(screen.getByRole('button', { name: /new chat/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/chat/new');
    });
  });

  describe('Welcome banner', () => {
    it('shows greeting with user first name', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: emptyConvState });
      await waitFor(() => {
        expect(screen.getByText(/Test/i)).toBeInTheDocument();
      });
    });

    it('shows default "Trader" greeting when no user', async () => {
      renderWithProviders(<Dashboard />);
      await waitFor(() => {
        expect(screen.getByText(/Trader/i)).toBeInTheDocument();
      });
    });
  });

  describe('Recent Chats section', () => {
    it('shows "No conversations yet" when list is empty', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: emptyConvState });
      await waitFor(() => {
        expect(screen.getByText('No conversations yet')).toBeInTheDocument();
      });
    });

    it('shows "Start your first chat" link in empty state', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: emptyConvState });
      await waitFor(() => {
        expect(screen.getByText('Start your first chat')).toBeInTheDocument();
      });
    });

    it('renders conversation titles when conversations exist', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: withConversations });
      await waitFor(() => {
        expect(screen.getByText('Trade talk')).toBeInTheDocument();
        expect(screen.getByText('Coffee prices')).toBeInTheDocument();
      });
    });

    it('renders last message preview for each conversation', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: withConversations });
      await waitFor(() => {
        expect(screen.getByText('What is HS code?')).toBeInTheDocument();
      });
    });

    it('clicking a conversation navigates to it', async () => {
      renderWithProviders(<Dashboard />, { preloadedState: withConversations });
      await waitFor(() => screen.getByText('Trade talk'));
      await userEvent.click(screen.getByText('Trade talk'));
      expect(mockNavigate).toHaveBeenCalledWith('/chat/c1');
    });
  });

  describe('Loading state', () => {
    it('shows a loading spinner while conversations are loading', async () => {
      const loadingState = {
        ...authenticatedState,
        chatHistory: { conversations: [], status: 'loading', error: null },
      };
      const { container } = renderWithProviders(<Dashboard />, { preloadedState: loadingState });
      await waitFor(() => {
        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
      });
    });
  });
});
