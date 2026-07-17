import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ChevronDown, Trash2 } from 'lucide-react';
import { clearChat } from '../../../redux/slices/chatSlice';
import { removeConversation, selectConversations } from '../../../redux/slices/chatHistorySlice';
import { apiFetch } from '../../../lib/apiFetch';
import { useSidebar } from './SidebarContext';
import { cn } from '../../../lib/utils';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ChatNav() {
  const { isCollapsed, isMobile, onClose } = useSidebar();
  const dispatch      = useDispatch();
  const navigate      = useNavigate();
  const conversations = useSelector(selectConversations);
  const [open, setOpen] = useState(true);
  const showText   = !isCollapsed || isMobile;
  const recentChats = conversations.slice(0, 8);

  const handleDeleteChat = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await apiFetch(`${BACKEND_URL}/api/chat/conversations/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) return;
      dispatch(removeConversation(id));
      if (window.location.pathname.includes(id)) {
        dispatch(clearChat());
        navigate('/chat/new');
      }
    } catch {}
  };

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => {
          if (!showText) {
            dispatch(clearChat());
            navigate('/chat/new');
            onClose?.();
          } else {
            setOpen((o) => !o);
          }
        }}
        title={!showText ? 'AI Chat' : undefined}
        className={cn(
          'w-full flex items-center gap-3 rounded-xl text-sm font-medium text-black/60 hover:bg-black/5 hover:text-black transition-all',
          showText ? 'px-3 py-2.5' : 'justify-center p-2.5'
        )}
      >
        <MessageSquare size={18} className="shrink-0" />
        {showText && (
          <>
            <span className="flex-1 text-left">AI Chat</span>
            <ChevronDown
              size={14}
              className={cn('transition-transform duration-200 text-black/30', open && 'rotate-180')}
            />
          </>
        )}
      </button>

      {showText && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="chat-history"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="ml-3 pl-3 border-l border-black/5 py-1 space-y-0.5 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/10">
                {recentChats.length === 0 ? (
                  <p className="text-xs text-black/30 py-1.5 px-2">No chats yet</p>
                ) : (
                  recentChats.map((c) => (
                    <div key={c._id} className="flex items-center gap-1 group/chat">
                      <NavLink
                        to={`/chat/${c._id}`}
                        onClick={() => onClose?.()}
                        className={({ isActive }) =>
                          cn(
                            'flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all min-w-0',
                            isActive
                              ? 'bg-accent/10 text-accent'
                              : 'text-black/50 hover:bg-black/4 hover:text-black'
                          )
                        }
                      >
                        <span className="w-1 h-1 rounded-full bg-current opacity-40 shrink-0" />
                        <span className="truncate">{c.title || 'Untitled'}</span>
                      </NavLink>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteChat(e, c._id)}
                        className="opacity-0 group-hover/chat:opacity-100 p-1 text-black/25 hover:text-red-500 transition-all shrink-0 rounded"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
