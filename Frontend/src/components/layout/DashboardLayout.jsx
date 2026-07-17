import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import ScrollToTop from '../common/ScrollToTop';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Menu, Settings, LogOut, ChevronDown, Crown, ArrowUpRight } from 'lucide-react';
import { clearUser, selectUser } from '../../redux/slices/authSlice';
import { clearChat } from '../../redux/slices/chatSlice';
import { clearEntitlements } from '../../redux/slices/entitlementSlice';
import { resetState } from '../../redux/store';
import Sidebar from '../dashboard/sidebar/Sidebar';
import { useEntitlements } from '../dashboard/subscriptions/hooks/useEntitlements';
import { cn } from '../../lib/utils';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function getInitials(name) {
  if (!name) return 'U';
  return name.trim().split(/\s+/).map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

function formatExpiry(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function UserAvatarDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user     = useSelector(selectUser);
  const { trade } = useEntitlements();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isTradeActive = trade?.status === 'active' && trade?.unlimitedAccess;
  const tradeExpiry = formatExpiry(trade?.endDate);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method:      'POST',
        credentials: 'include',
      });
    } catch {}
    dispatch(clearUser());
    dispatch(clearChat());
    dispatch(clearEntitlements());
    dispatch(resetState());
    navigate('/');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-black/5 transition-colors"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold shrink-0 select-none">
          {getInitials(user?.name)}
        </div>
        <ChevronDown
          size={14}
          className={cn('text-black/40 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-black/5 shadow-xl shadow-black/8 py-1.5 z-50"
        >
          <div className="px-4 py-2.5 border-b border-black/5 mb-1">
            <div className="text-sm font-bold truncate">{user?.name || 'User'}</div>
            <div className="text-xs text-black/40 truncate">{user?.email}</div>
          </div>

          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-black/60 hover:bg-black/3 hover:text-black transition-colors"
          >
            <Settings size={14} /> Settings
          </Link>

          <Link
            to="/trade/upgrade"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm transition-colors"
            style={{ color: '#1d4ed8' }}
          >
            <Crown size={14} />
            <span className="flex-1">
              {isTradeActive ? 'Current Plan' : 'Upgrade'}
              {isTradeActive && tradeExpiry && (
                <span className="block text-[11px]" style={{ color: '#64748b' }}>
                  Expires {tradeExpiry}
                </span>
              )}
            </span>
            <ArrowUpRight size={13} />
          </Link>

          <div className="my-1 mx-3 border-t border-black/5" />

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50/70 transition-colors"
          >
            <LogOut size={14} /> Sign out
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const mainRef = useRef(null);

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      {/*
        overflow-x-hidden (not overflow-hidden) so the absolutely-positioned
        dropdown in the header is not clipped by this container.
      */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-black/5 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="hidden md:block" />
          <UserAvatarDropdown />
        </header>

        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <ScrollToTop containerRef={mainRef} />
          <Outlet />
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable={false}
      />
    </div>
  );
}
