import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages:             [],
    activeConversationId: null,
  },
  reducers: {
    setMessages(state, { payload }) {
      state.messages = payload;
    },
    appendMessage(state, { payload }) {
      state.messages.push(payload);
    },
    removeLastMessage(state) {
      state.messages.pop();
    },
    setActiveConvId(state, { payload }) {
      state.activeConversationId = payload;
    },
    clearChat(state) {
      state.messages             = [];
      state.activeConversationId = null;
    },
  },
});

export const {
  setMessages,
  appendMessage,
  removeLastMessage,
  setActiveConvId,
  clearChat,
} = chatSlice.actions;

export const selectMessages     = (state) => state.chat.messages;
export const selectActiveConvId = (state) => state.chat.activeConversationId;

export default chatSlice.reducer;
