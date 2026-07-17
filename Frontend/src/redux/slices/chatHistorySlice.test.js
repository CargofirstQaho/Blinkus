import { configureStore } from '@reduxjs/toolkit';
import chatHistoryReducer, {
  fetchChatHistory,
  setConversations,
  prependConversation,
  removeConversation,
  updateConvTitle,
  updateConvLastMessage,
  resetChatHistory,
  selectConversations,
  selectChatHistoryStatus,
  selectChatHistoryError,
} from './chatHistorySlice';

jest.mock('../../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
  SessionExpiredError: class SessionExpiredError extends Error {
    constructor() { super('session_expired'); this.name = 'SessionExpiredError'; }
  },
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

const { apiFetch, SessionExpiredError } = require('../../lib/apiFetch');

const initialState = {
  conversations: [],
  status: 'idle',
  error: null,
};

const conv1 = { _id: 'conv-1', title: 'First Chat', lastMessage: 'Hello' };
const conv2 = { _id: 'conv-2', title: 'Second Chat', lastMessage: 'World' };

function makeStore(preloadedState) {
  return configureStore({
    reducer: { chatHistory: chatHistoryReducer },
    preloadedState,
  });
}

describe('chatHistorySlice', () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(chatHistoryReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });
  });

  describe('setConversations', () => {
    it('sets conversations array and marks succeeded', () => {
      const state = chatHistoryReducer(undefined, setConversations([conv1, conv2]));
      expect(state.conversations).toEqual([conv1, conv2]);
      expect(state.status).toBe('succeeded');
    });
  });

  describe('prependConversation', () => {
    it('adds conversation at the beginning', () => {
      const preState = { ...initialState, conversations: [conv2] };
      const state = chatHistoryReducer(preState, prependConversation(conv1));
      expect(state.conversations[0]).toEqual(conv1);
      expect(state.conversations).toHaveLength(2);
    });
  });

  describe('removeConversation', () => {
    it('removes conversation by id', () => {
      const preState = { ...initialState, conversations: [conv1, conv2] };
      const state = chatHistoryReducer(preState, removeConversation('conv-1'));
      expect(state.conversations).toHaveLength(1);
      expect(state.conversations[0]._id).toBe('conv-2');
    });

    it('does nothing if id not found', () => {
      const preState = { ...initialState, conversations: [conv1] };
      const state = chatHistoryReducer(preState, removeConversation('nonexistent'));
      expect(state.conversations).toHaveLength(1);
    });
  });

  describe('updateConvTitle', () => {
    it('updates title of matching conversation', () => {
      const preState = { ...initialState, conversations: [conv1, conv2] };
      const state = chatHistoryReducer(preState, updateConvTitle({ id: 'conv-1', title: 'New Title' }));
      expect(state.conversations.find((c) => c._id === 'conv-1').title).toBe('New Title');
    });
  });

  describe('updateConvLastMessage', () => {
    it('updates lastMessage of matching conversation', () => {
      const preState = { ...initialState, conversations: [conv1, conv2] };
      const state = chatHistoryReducer(preState, updateConvLastMessage({ id: 'conv-1', text: 'Updated!' }));
      expect(state.conversations.find((c) => c._id === 'conv-1').lastMessage).toBe('Updated!');
    });
  });

  describe('resetChatHistory', () => {
    it('resets conversations, status and error', () => {
      const preState = { conversations: [conv1], status: 'succeeded', error: 'oops' };
      const state = chatHistoryReducer(preState, resetChatHistory());
      expect(state).toEqual(initialState);
    });
  });

  describe('Selectors', () => {
    const rootState = {
      chatHistory: { conversations: [conv1, conv2], status: 'succeeded', error: null },
    };

    it('selectConversations returns conversations', () => {
      expect(selectConversations(rootState)).toEqual([conv1, conv2]);
    });

    it('selectChatHistoryStatus returns status', () => {
      expect(selectChatHistoryStatus(rootState)).toBe('succeeded');
    });

    it('selectChatHistoryError returns error', () => {
      expect(selectChatHistoryError(rootState)).toBeNull();
    });
  });

  describe('fetchChatHistory thunk', () => {
    it('sets status to loading then succeeded with conversations on success', async () => {
      apiFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: { conversations: [conv1, conv2] } }),
      });

      const store = makeStore();
      const promise = store.dispatch(fetchChatHistory());
      expect(store.getState().chatHistory.status).toBe('loading');

      await promise;

      expect(store.getState().chatHistory.status).toBe('succeeded');
      expect(store.getState().chatHistory.conversations).toEqual([conv1, conv2]);
      expect(store.getState().chatHistory.error).toBeNull();
    });

    it('sets status to failed with an error message on API failure', async () => {
      apiFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Boom' }),
      });

      const store = makeStore();
      await store.dispatch(fetchChatHistory());

      expect(store.getState().chatHistory.status).toBe('failed');
      expect(store.getState().chatHistory.error).toBe('Boom');
    });

    it('sets status to failed without error message on session expiry', async () => {
      apiFetch.mockRejectedValue(new SessionExpiredError());

      const store = makeStore();
      await store.dispatch(fetchChatHistory());

      expect(store.getState().chatHistory.status).toBe('failed');
      expect(store.getState().chatHistory.error).toBeNull();
    });

    it('does not refetch when already succeeded', async () => {
      apiFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: { conversations: [conv1] } }),
      });

      const store = makeStore({ chatHistory: { conversations: [conv1], status: 'succeeded', error: null } });
      await store.dispatch(fetchChatHistory());

      expect(apiFetch).not.toHaveBeenCalled();
    });

    it('does not refetch when already loading', async () => {
      let resolveFetch;
      apiFetch.mockReturnValue(new Promise((resolve) => { resolveFetch = resolve; }));

      const store = makeStore();
      const first = store.dispatch(fetchChatHistory());
      const second = store.dispatch(fetchChatHistory());

      resolveFetch({
        ok: true,
        json: () => Promise.resolve({ data: { conversations: [] } }),
      });
      await Promise.all([first, second]);

      expect(apiFetch).toHaveBeenCalledTimes(1);
    });
  });
});
