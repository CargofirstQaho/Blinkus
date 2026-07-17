import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchChatHistory = createAsyncThunk(
  'chatHistory/fetchChatHistory',
  async (_, { rejectWithValue }) => {
    // Lazy-loaded to avoid a circular import (apiFetch -> store -> this slice -> apiFetch)
    const { apiFetch, SessionExpiredError } = await import('../../lib/apiFetch');
    try {
      const res  = await apiFetch(`${BACKEND_URL}/api/chat/conversations`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to load conversations');
      return data.data.conversations;
    } catch (err) {
      if (err instanceof SessionExpiredError) return rejectWithValue({ silent: true });
      if (err.name === 'TypeError') {
        toast.error('Cannot connect to server. Please try again.');
      } else {
        toast.error(err.message || 'Failed to load conversations');
      }
      return rejectWithValue({ message: err.message });
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().chatHistory;
      return status !== 'loading' && status !== 'succeeded';
    },
  }
);

const chatHistorySlice = createSlice({
  name: 'chatHistory',
  initialState: {
    conversations: [],
    status:        'idle', // idle | loading | succeeded | failed
    error:         null,
  },
  reducers: {
    setConversations(state, { payload }) {
      state.conversations = payload;
      state.status        = 'succeeded';
      state.error         = null;
    },
    prependConversation(state, { payload }) {
      state.conversations.unshift(payload);
    },
    removeConversation(state, { payload: id }) {
      state.conversations = state.conversations.filter((c) => c._id !== id);
    },
    updateConvTitle(state, { payload: { id, title } }) {
      const conv = state.conversations.find((c) => c._id === id);
      if (conv) conv.title = title;
    },
    updateConvLastMessage(state, { payload: { id, text } }) {
      const conv = state.conversations.find((c) => c._id === id);
      if (conv) conv.lastMessage = text;
    },
    resetChatHistory(state) {
      state.conversations = [];
      state.status        = 'idle';
      state.error         = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.status = 'loading';
        state.error  = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, { payload }) => {
        state.status        = 'succeeded';
        state.conversations = payload;
        state.error         = null;
      })
      .addCase(fetchChatHistory.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error  = payload?.silent ? null : (payload?.message || 'Failed to load conversations');
      });
  },
});

export const {
  setConversations,
  prependConversation,
  removeConversation,
  updateConvTitle,
  updateConvLastMessage,
  resetChatHistory,
} = chatHistorySlice.actions;

export const selectConversations     = (state) => state.chatHistory.conversations;
export const selectChatHistoryStatus = (state) => state.chatHistory.status;
export const selectChatHistoryError  = (state) => state.chatHistory.error;

export default chatHistorySlice.reducer;
