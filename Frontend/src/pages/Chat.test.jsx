import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { toast } from 'react-toastify';
import Chat from './Chat';
import { createTestStore, authenticatedState } from '../tests/utils';

const mockApiFetch = jest.fn();
jest.mock('../lib/apiFetch', () => ({
  apiFetch: (...args) => mockApiFetch(...args),
  SessionExpiredError: class SessionExpiredError extends Error {
    constructor() { super('session_expired'); this.name = 'SessionExpiredError'; }
  },
}));

jest.mock('../redux/slices/chatHistorySlice', () => ({
  ...jest.requireActual('../redux/slices/chatHistorySlice'),
  fetchChatHistory: jest.fn(() => ({ type: 'chatHistory/fetchAll/fulfilled', payload: [] })),
}));

// jsdom does not implement scrollIntoView — mock it globally for this suite
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

function renderChat({ route = '/chat/new', preloadedState = {} } = {}) {
  const store = createTestStore({ ...authenticatedState, ...preloadedState });
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/chat/:chatId" element={<Chat />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
  };
}

// The send button has no accessible text (icon-only). It sits immediately after the
// textarea in the DOM, so we find it via sibling traversal to avoid ambiguity with
// the suggestion prompt buttons that also render as <button> in the empty-chat state.
function getSendButton() {
  return screen.getByPlaceholderText(/ask about prices/i).nextElementSibling;
}

describe('Chat Page', () => {
  beforeEach(() => {
    mockApiFetch.mockReset();
    toast.error.mockReset();
    mockApiFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { messages: [], conversations: [] } }),
    });
  });

  describe('Rendering', () => {
    it('renders the Blinkus Intelligence header', () => {
      renderChat();
      expect(screen.getByText('Blinkus Intelligence')).toBeInTheDocument();
    });

    it('shows "Online" status indicator', () => {
      renderChat();
      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('renders the message textarea', () => {
      renderChat();
      expect(screen.getByPlaceholderText(/ask about prices/i)).toBeInTheDocument();
    });

    it('renders the Send button', () => {
      renderChat();
      expect(getSendButton()).toBeInTheDocument();
    });

    it('renders disclaimer text', () => {
      renderChat();
      expect(screen.getByText(/Blinkus Intelligence may produce inaccurate trade data/i)).toBeInTheDocument();
    });
  });

  describe('Empty state (new chat)', () => {
    it('shows "Ask Blinkus Intelligence" heading when no messages', () => {
      renderChat({ route: '/chat/new' });
      expect(screen.getByText('Ask Blinkus Intelligence')).toBeInTheDocument();
    });

    it('shows all four suggestion prompts', () => {
      renderChat({ route: '/chat/new' });
      expect(screen.getByText(/current coffee Arabica price/i)).toBeInTheDocument();
      expect(screen.getByText(/Analyze risk for shipping/i)).toBeInTheDocument();
      expect(screen.getByText(/HS code for organic cotton/i)).toBeInTheDocument();
      expect(screen.getByText(/Compare freight rates/i)).toBeInTheDocument();
    });
  });

  describe('Send button state', () => {
    it('send button is disabled when input is empty', () => {
      renderChat();
      expect(getSendButton()).toBeDisabled();
    });

    it('send button is enabled after typing a message', async () => {
      renderChat();
      const textarea = screen.getByPlaceholderText(/ask about prices/i);
      await userEvent.type(textarea, 'What is HS code for coffee?');
      expect(getSendButton()).not.toBeDisabled();
    });

    it('send button is disabled when input is only whitespace', async () => {
      renderChat();
      const textarea = screen.getByPlaceholderText(/ask about prices/i);
      await userEvent.type(textarea, '   ');
      expect(getSendButton()).toBeDisabled();
    });
  });

  describe('Suggestion prompts', () => {
    it('clicking a suggestion fills the textarea', async () => {
      renderChat({ route: '/chat/new' });
      const suggestionBtn = screen.getByText(/HS code for organic cotton/i);
      await userEvent.click(suggestionBtn);
      const textarea = screen.getByPlaceholderText(/ask about prices/i);
      expect(textarea).toHaveValue('Get HS code for organic cotton fabric');
    });

    it('clicking a suggestion enables the send button', async () => {
      renderChat({ route: '/chat/new' });
      const suggestionBtn = screen.getByText(/Analyze risk for shipping/i);
      await userEvent.click(suggestionBtn);
      expect(getSendButton()).not.toBeDisabled();
    });
  });

  describe('Send message', () => {
    it('dispatches optimistic user message on send', async () => {
      const convId = 'conv-new-1';
      mockApiFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ data: { conversation: { _id: convId, title: 'Test' } } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ data: { message: { _id: 'msg-1', role: 'assistant', content: 'AI response here' } } }),
        });

      const { store } = renderChat({ route: '/chat/new' });
      const textarea = screen.getByPlaceholderText(/ask about prices/i);
      await userEvent.type(textarea, 'What is HS code?');
      await userEvent.click(getSendButton());

      await waitFor(() => {
        const state = store.getState();
        expect(state.chat.messages.length).toBeGreaterThan(0);
      });
    });

    it('calls POST /api/chat/conversations to create a new conversation', async () => {
      mockApiFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ data: { conversation: { _id: 'conv-1', title: 'Test' } } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ data: { message: { _id: 'msg-1', role: 'assistant', content: 'Answer' } } }),
        });

      renderChat({ route: '/chat/new' });
      const textarea = screen.getByPlaceholderText(/ask about prices/i);
      await userEvent.type(textarea, 'Hello');
      await userEvent.click(getSendButton());

      await waitFor(() => {
        expect(mockApiFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/chat/conversations'),
          expect.objectContaining({ method: 'POST' }),
        );
      });
    });

    it('calls POST /api/chat/conversations/:id/messages to send message', async () => {
      mockApiFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ data: { conversation: { _id: 'conv-123', title: 'Test' } } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ data: { message: { _id: 'msg-1', role: 'assistant', content: 'Answer' } } }),
        });

      renderChat({ route: '/chat/new' });
      const textarea = screen.getByPlaceholderText(/ask about prices/i);
      await userEvent.type(textarea, 'Hello');
      await userEvent.click(getSendButton());

      await waitFor(() => {
        expect(mockApiFetch).toHaveBeenCalledWith(
          expect.stringContaining('/conversations/conv-123/messages'),
          expect.objectContaining({ method: 'POST' }),
        );
      });
    });

    it('clears the textarea after sending', async () => {
      mockApiFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ data: { conversation: { _id: 'conv-1', title: 'Test' } } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ data: { message: { _id: 'm1', role: 'assistant', content: 'OK' } } }),
        });

      renderChat({ route: '/chat/new' });
      const textarea = screen.getByPlaceholderText(/ask about prices/i);
      await userEvent.type(textarea, 'My question');
      await userEvent.click(getSendButton());
      await waitFor(() => {
        expect(textarea).toHaveValue('');
      });
    });
  });

  describe('Keyboard interaction', () => {
    it('pressing Enter sends the message', async () => {
      mockApiFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ data: { conversation: { _id: 'conv-1', title: 'Test' } } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ data: { message: { _id: 'm1', role: 'assistant', content: 'OK' } } }),
        });

      renderChat({ route: '/chat/new' });
      const textarea = screen.getByPlaceholderText(/ask about prices/i);
      await userEvent.type(textarea, 'Hello{Enter}');
      await waitFor(() => {
        expect(mockApiFetch).toHaveBeenCalled();
      });
    });

    it('pressing Shift+Enter does not send and adds newline', async () => {
      renderChat({ route: '/chat/new' });
      const textarea = screen.getByPlaceholderText(/ask about prices/i);
      await userEvent.type(textarea, 'Hello');
      await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
      expect(mockApiFetch).not.toHaveBeenCalled();
    });
  });

  describe('Error states', () => {
    it('shows error toast when sending a message fails', async () => {
      mockApiFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ data: { conversation: { _id: 'conv-1', title: 'Test' } } }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: jest.fn().mockResolvedValue({ message: 'Rate limit exceeded' }),
        });

      renderChat({ route: '/chat/new' });
      const textarea = screen.getByPlaceholderText(/ask about prices/i);
      await userEvent.type(textarea, 'Hello');
      await userEvent.click(getSendButton());
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Rate limit exceeded');
      });
    });

    it('shows connection error toast on network failure', async () => {
      const err = new Error('fetch failed');
      err.name = 'TypeError';
      mockApiFetch.mockRejectedValueOnce(err);
      renderChat({ route: '/chat/new' });
      const textarea = screen.getByPlaceholderText(/ask about prices/i);
      await userEvent.type(textarea, 'Hello');
      await userEvent.click(getSendButton());
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Cannot connect to server. Please try again.');
      });
    });
  });

  describe('Existing conversation', () => {
    it('loads messages from API when given an existing chatId', async () => {
      const messages = [
        { _id: 'm1', role: 'user', content: 'Hi there' },
        { _id: 'm2', role: 'assistant', content: 'Hello!' },
      ];
      mockApiFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: { messages } }),
      });
      renderChat({ route: '/chat/conv-existing' });
      await waitFor(() => {
        expect(mockApiFetch).toHaveBeenCalledWith(
          expect.stringContaining('/conversations/conv-existing'),
        );
      });
    });

    it('shows messages loaded from API for an existing conversation', async () => {
      const messages = [
        { _id: 'm1', role: 'user', content: 'My question' },
        { _id: 'm2', role: 'assistant', content: 'My answer' },
      ];
      mockApiFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: { messages } }),
      });
      renderChat({ route: '/chat/conv-1' });
      await waitFor(() => {
        expect(screen.getByText('My question')).toBeInTheDocument();
        expect(screen.getByText('My answer')).toBeInTheDocument();
      });
    });

    it('shows error toast when loading messages fails', async () => {
      mockApiFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Conversation not found' }),
      });
      renderChat({ route: '/chat/bad-id' });
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Conversation not found');
      });
    });
  });
});
