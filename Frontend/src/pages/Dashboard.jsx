import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, Zap, ArrowRight, BarChart3, Shield, Plus, Clock } from 'lucide-react';
import { fetchChatHistory, selectConversations, selectChatHistoryStatus } from '../redux/slices/chatHistorySlice';
import HeroBanner from '../components/dashboard/banner/HeroBanner';
import Spinner from '../components/ui/Spinner';
import FutureBanner from '../components/dashboard/comingSoon/FutureBanner';
import ComingSoonSection from '../components/dashboard/comingSoon/ComingSoonSection';
import RoadmapTimeline from '../components/dashboard/comingSoon/RoadmapTimeline';
// import SubscriptionStatusCard from '../components/dashboard/subscriptions/components/SubscriptionStatusCard';
import { useEntitlements } from '../components/dashboard/subscriptions/hooks/useEntitlements';

const QUICK_ACTIONS = [
  { label: 'Ask Trade Agent', icon: MessageSquare, href: '/chat/new', desc: 'Get AI-powered trade insights' },
  { label: 'Market Analysis', icon: BarChart3,     href: '/chat/new', desc: 'Analyze commodity benchmarks'  },
  { label: 'Risk Assessment', icon: Shield,        href: '/chat/new', desc: 'Check route and partner risk'  },
  { label: 'HS Code Lookup',  icon: Zap,           href: '/chat/new', desc: 'Classify your products fast'   },
];

export default function Dashboard() {
  const dispatch      = useDispatch();
  const navigate      = useNavigate();
  const conversations = useSelector(selectConversations);
  const historyStatus = useSelector(selectChatHistoryStatus);
  const { trade } = useEntitlements();
  const roadmapRef = useRef(null);

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

  const loading = historyStatus === 'idle' || historyStatus === 'loading';

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <HeroBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-black/5 flex items-center justify-between">
              <h2 className="font-display font-bold">Quick Actions</h2>
              <button
                type="button"
                onClick={() => navigate('/chat/new')}
                className="flex items-center gap-1.5 text-accent text-sm font-semibold hover:underline"
              >
                <Plus size={14} /> New Chat
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 sm:p-5">
              {QUICK_ACTIONS.map(({ label, icon: Icon, href, desc }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => navigate(href)}
                  className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border border-black/5 hover:border-accent/30 hover:bg-accent/3 transition-all text-left group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-all">
                    <Icon size={17} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm">{label}</div>
                    <div className="text-xs text-black/40 mt-0.5 leading-snug">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
          {/* <SubscriptionStatusCard trade={trade} compact /> */}

          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-black/5 flex items-center justify-between">
            <h2 className="font-display font-bold">Recent Chats</h2>
            <Clock size={16} className="text-black/30" />
          </div>
          <div className="p-3">
            {loading ? (
              <div className="flex justify-center py-8"><Spinner size="sm" /></div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 sm:py-10 px-4">
                <MessageSquare size={32} className="text-black/10 mx-auto mb-3" />
                <p className="text-sm font-medium text-black/40">No conversations yet</p>
                <button
                  type="button"
                  onClick={() => navigate('/chat/new')}
                  className="mt-4 text-accent text-sm font-semibold hover:underline flex items-center gap-1 mx-auto"
                >
                  Start your first chat <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.slice(0, 8).map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => navigate(`/chat/${c._id}`)}
                    className="w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-black/3 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                      <MessageSquare size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.title || 'Untitled Chat'}</div>
                      <div className="text-xs text-black/30 truncate">{c.lastMessage || 'No messages'}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
