import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { Send, Bot, User, Copy, Check, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  setMessages,
  appendMessage,
  removeLastMessage,
  setActiveConvId,
  clearChat,
  selectMessages,
  selectActiveConvId,
} from '../redux/slices/chatSlice';
import {
  fetchChatHistory,
  prependConversation,
  updateConvLastMessage,
} from '../redux/slices/chatHistorySlice';
import { apiFetch, SessionExpiredError } from '../lib/apiFetch';
import { useAiUsageLimit } from '../hooks/useAiUsageLimit';
import { cn } from '../lib/utils';
import Spinner from '../components/ui/Spinner';
import MessageContent from '../components/chat/MessageContent';
import AiUsageLimitBanner from '../components/chat/AiUsageLimitBanner';
import FreePlanUsageBanner from '../components/chat/FreePlanUsageBanner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyText = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-2 sm:gap-3 group', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <div className={cn(
        'w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 mt-1',
        isUser ? 'bg-accent text-white' : 'bg-black/5 text-black/60'
      )}>
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      <div className={cn(
        'max-w-[85%] sm:max-w-[75%] space-y-1 flex flex-col',
        isUser ? 'items-end' : 'items-start'
      )}>
        <div className={cn(
          'px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-accent text-white rounded-tr-sm whitespace-pre-wrap break-words'
            : 'bg-white border border-black/5 text-black rounded-tl-sm shadow-sm'
        )}>
          {isUser
            ? message.content
            : <MessageContent content={message.content} />
          }
        </div>
        <button
          type="button"
          onClick={copyText}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-black/30 hover:text-black/60 p-1"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2 sm:gap-3">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
        <Bot size={14} className="text-black/60" />
      </div>
      <div className="bg-white border border-black/5 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className="w-1.5 h-1.5 bg-black/30 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "What's the current coffee Arabica price from Brazil?",
  'Analyze risk for shipping through Red Sea right now',
  'Get HS code for organic cotton fabric',
  'Compare freight rates: Asia to EU this month',
];

export default function Chat() {
  const { chatId }  = useParams();
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const isNew       = chatId === 'new';

  const messages = useSelector(selectMessages);
  const activeId = useSelector(selectActiveConvId);

  const { reportUsageResponse } = useAiUsageLimit();

  const [input, setInput]               = useState('');
  const [isSending, setIsSending]       = useState(false);
  const [isLoadingMsgs, setLoadingMsgs] = useState(false);

  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const skipLoadRef = useRef(false);

  // ── Data loading ─────────────────────────────────────────────────────────

  const loadMessages = useCallback(async (id) => {
    setLoadingMsgs(true);
    try {
      const res  = await apiFetch(`${BACKEND_URL}/api/chat/conversations/${id}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to load messages');
      dispatch(setMessages(data.data.messages));
      dispatch(setActiveConvId(id));
    } catch (err) {
      if (err instanceof SessionExpiredError) return;
      if (err.name === 'TypeError') {
        toast.error('Cannot connect to server. Please try again.');
      } else {
        toast.error(err.message || 'Something went wrong');
      }
    } finally {
      setLoadingMsgs(false);
    }
  }, [dispatch]);

  useEffect(() => { dispatch(fetchChatHistory()); }, [dispatch]);

  useEffect(() => {
    if (isNew) { dispatch(clearChat()); return; }
    if (skipLoadRef.current) { skipLoadRef.current = false; return; }
    loadMessages(chatId);
  }, [chatId, isNew, loadMessages, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // ── Send message ──────────────────────────────────────────────────────────

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isSending) return;

    setInput('');
    // Reset textarea height immediately — React state change alone won't fire onInput
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setIsSending(true);

    const optimisticMsg = { role: 'user', content: text, _id: `opt-${Date.now()}` };
    dispatch(appendMessage(optimisticMsg));

    try {
      let convId = isNew ? null : (activeId || chatId);

      if (!convId) {
        const createRes  = await apiFetch(`${BACKEND_URL}/api/chat/conversations`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ title: text.slice(0, 60) }),
        });
        const createData = await createRes.json().catch(() => ({}));
        if (!createRes.ok) throw new Error(createData.message || 'Failed to create conversation');
        convId = createData.data.conversation._id;
        dispatch(prependConversation(createData.data.conversation));
        dispatch(setActiveConvId(convId));
      }

      const sendRes  = await apiFetch(`${BACKEND_URL}/api/chat/conversations/${convId}/messages`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ content: text }),
      });
      const sendData = await sendRes.json().catch(() => ({}));

      if (reportUsageResponse(sendRes, sendData)) {
        dispatch(removeLastMessage());
        return;
      }

      if (!sendRes.ok) throw new Error(sendData.message || 'Failed to send message');

      dispatch(appendMessage(sendData.data.message));
      dispatch(updateConvLastMessage({ id: convId, text: sendData.data.message.content.slice(0, 80) }));

      if (isNew) {
        skipLoadRef.current = true;
        navigate(`/chat/${convId}`, { replace: true });
      }
    } catch (err) {
      dispatch(removeLastMessage());
      if (err instanceof SessionExpiredError) return;
      if (err.name === 'TypeError') {
        toast.error('Cannot connect to server. Please try again.');
      } else {
        toast.error(err.message || 'Failed to send message');
      }
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  }, [input, isSending, isNew, activeId, chatId, dispatch, navigate, reportUsageResponse]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 border-b border-black/5 bg-white shrink-0">
        <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
          <Bot size={16} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold leading-tight">Blinkus Intelligence</div>
          <div className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 space-y-4">
        {isLoadingMsgs ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5 rotate-6">
              <Bot size={28} className="sm:hidden" />
              <Bot size={32} className="hidden sm:block" />
            </div>
            <h2 className="text-lg sm:text-xl font-display font-bold mb-2">Ask Blinkus Intelligence</h2>
            <p className="text-black/40 text-sm max-w-xs sm:max-w-sm mb-7 leading-relaxed">
              Your AI-powered global trade agent. Ask anything from commodity prices to HS codes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md sm:max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="text-left p-3 rounded-xl border border-black/8 hover:border-accent/30 hover:bg-accent/3 text-xs font-medium text-black/60 hover:text-black transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) => <MessageBubble key={m._id} message={m} />)}
            {isSending && <TypingIndicator />}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      <div className="px-3 py-3 sm:px-4 sm:py-4 bg-white border-t border-black/5 shrink-0">
        <FreePlanUsageBanner />
        <AiUsageLimitBanner />
        <div className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            placeholder="Ask about prices, buyers/sellers, trade related questions."
            className="flex-1 resize-none px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-black/10 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm disabled:opacity-60 overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px';
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className={cn(
              'w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-all',
              input.trim() && !isSending
                ? 'bg-accent text-white hover:bg-accent/90 shadow-md shadow-accent/25'
                : 'bg-black/3 text-black/30 cursor-not-allowed'
            )}
          >
            {isSending ? <Loader2 size={16} className="animate-spin sm:w-[18px] sm:h-[18px]" /> : <Send size={16} className="sm:w-[18px] sm:h-[18px]" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-black/20 mt-2 max-w-4xl mx-auto">
          Blinkus is AI and can make mistakes.
        </p>
      </div>
    </div>
  );
}
