import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatNav from './ChatNav';
import { SidebarCtx } from './SidebarContext';
import { renderWithProviders } from '../../../tests/utils';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
}));

import { apiFetch } from '../../../lib/apiFetch';

const chatHistoryState = (conversations = []) => ({
  chatHistory: { conversations, status: 'succeeded', error: null },
});

function renderChatNav(sidebarCtx, preloadedState) {
  return renderWithProviders(
    <SidebarCtx.Provider value={sidebarCtx}>
      <ChatNav />
    </SidebarCtx.Provider>,
    { preloadedState },
  );
}

describe('ChatNav', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    apiFetch.mockReset();
  });

  it('renders the AI Chat label when expanded', () => {
    renderChatNav({ isCollapsed: false, isMobile: false, onClose: null }, chatHistoryState());

    expect(screen.getByText('AI Chat')).toBeInTheDocument();
  });

  it('shows "No chats yet" when there are no conversations', () => {
    renderChatNav({ isCollapsed: false, isMobile: false, onClose: null }, chatHistoryState());

    expect(screen.getByText('No chats yet')).toBeInTheDocument();
  });

  it('renders recent conversation titles, falling back to "Untitled"', () => {
    renderChatNav(
      { isCollapsed: false, isMobile: false, onClose: null },
      chatHistoryState([
        { _id: 'c1', title: 'First Chat' },
        { _id: 'c2', title: '' },
      ]),
    );

    expect(screen.getByText('First Chat')).toBeInTheDocument();
    expect(screen.getByText('Untitled')).toBeInTheDocument();
  });

  it('toggles the chat history list when the header button is clicked', async () => {
    renderChatNav({ isCollapsed: false, isMobile: false, onClose: null }, chatHistoryState());

    expect(screen.getByText('No chats yet')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /ai chat/i }));
    expect(screen.queryByText('No chats yet')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /ai chat/i }));
    expect(screen.getByText('No chats yet')).toBeInTheDocument();
  });

  it('navigates to /chat/new and closes the sidebar when collapsed and clicked', async () => {
    const onClose = jest.fn();
    renderChatNav({ isCollapsed: true, isMobile: false, onClose }, chatHistoryState());

    await userEvent.click(screen.getByRole('button'));

    expect(mockNavigate).toHaveBeenCalledWith('/chat/new');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deletes a conversation when its delete button is clicked', async () => {
    apiFetch.mockResolvedValue({ ok: true });

    renderChatNav(
      { isCollapsed: false, isMobile: false, onClose: null },
      chatHistoryState([{ _id: 'c1', title: 'Chat One' }]),
    );

    expect(screen.getByText('Chat One')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons[buttons.length - 1];
    await userEvent.click(deleteButton);

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/chat/conversations/c1'),
      expect.objectContaining({ method: 'DELETE' }),
    );
    expect(screen.queryByText('Chat One')).not.toBeInTheDocument();
  });
});
