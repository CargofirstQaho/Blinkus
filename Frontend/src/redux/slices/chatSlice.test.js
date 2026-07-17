import chatReducer, {
  setMessages,
  appendMessage,
  removeLastMessage,
  setActiveConvId,
  clearChat,
  selectMessages,
  selectActiveConvId,
} from './chatSlice';

const initialState = {
  messages: [],
  activeConversationId: null,
};

const msg1 = { _id: 'msg-1', role: 'user', content: 'Hi' };
const msg2 = { _id: 'msg-2', role: 'assistant', content: 'Hello there!' };

describe('chatSlice', () => {
  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(chatReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('messages is empty array by default', () => {
      const state = chatReducer(undefined, { type: '@@INIT' });
      expect(state.messages).toEqual([]);
    });

    it('activeConversationId is null by default', () => {
      const state = chatReducer(undefined, { type: '@@INIT' });
      expect(state.activeConversationId).toBeNull();
    });
  });

  describe('setMessages', () => {
    it('sets messages array', () => {
      const state = chatReducer(undefined, setMessages([msg1, msg2]));
      expect(state.messages).toEqual([msg1, msg2]);
    });
  });

  describe('appendMessage', () => {
    it('appends message to end of array', () => {
      const preState = { ...initialState, messages: [msg1] };
      const state = chatReducer(preState, appendMessage(msg2));
      expect(state.messages).toHaveLength(2);
      expect(state.messages[1]).toEqual(msg2);
    });
  });

  describe('removeLastMessage', () => {
    it('removes the last message', () => {
      const preState = { ...initialState, messages: [msg1, msg2] };
      const state = chatReducer(preState, removeLastMessage());
      expect(state.messages).toHaveLength(1);
      expect(state.messages[0]).toEqual(msg1);
    });

    it('handles empty messages array gracefully', () => {
      const state = chatReducer(undefined, removeLastMessage());
      expect(state.messages).toHaveLength(0);
    });
  });

  describe('setActiveConvId', () => {
    it('sets active conversation id', () => {
      const state = chatReducer(undefined, setActiveConvId('conv-1'));
      expect(state.activeConversationId).toBe('conv-1');
    });

    it('can clear active conv id with null', () => {
      const preState = { ...initialState, activeConversationId: 'conv-1' };
      const state = chatReducer(preState, setActiveConvId(null));
      expect(state.activeConversationId).toBeNull();
    });
  });

  describe('clearChat', () => {
    it('clears messages and activeConversationId', () => {
      const preState = {
        messages: [msg1, msg2],
        activeConversationId: 'conv-1',
      };
      const state = chatReducer(preState, clearChat());
      expect(state.messages).toEqual([]);
      expect(state.activeConversationId).toBeNull();
    });
  });

  describe('Selectors', () => {
    const rootState = {
      chat: {
        messages: [msg1, msg2],
        activeConversationId: 'conv-1',
      },
    };

    it('selectMessages returns messages', () => {
      expect(selectMessages(rootState)).toEqual([msg1, msg2]);
    });

    it('selectActiveConvId returns active id', () => {
      expect(selectActiveConvId(rootState)).toBe('conv-1');
    });
  });
});
