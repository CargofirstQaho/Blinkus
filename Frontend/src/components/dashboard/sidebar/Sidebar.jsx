import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { clearChat } from '../../../redux/slices/chatSlice';
import { SidebarCtx } from './SidebarContext';
import DashboardNav           from './DashboardNav';
import ChatNav                from './ChatNav';
import TradeNav               from './TradeNav';
import ComingSoonSidebarGroup from './ComingSoonSidebarGroup';
import SettingsNav     from './SettingsNav';
import UserNav         from './UserNav';
import { cn } from '../../../lib/utils';
// import logoImg from '../../../assets/logo2.png';
// import logoImg from '../../../assets/BlinkusLogo.jpeg';
import logoImg from '../../../assets/logoBG.png';


function SidebarInner({ isCollapsed, isMobile, onToggleCollapse, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showText = !isCollapsed || isMobile;

  return (
    <SidebarCtx.Provider value={{ isCollapsed, isMobile, onClose }}>
      <div
        className={cn(
          'flex flex-col h-full bg-white border-r border-black/5',
          isMobile
            ? 'w-72'
            : cn('transition-all duration-300 ease-in-out', isCollapsed ? 'w-16' : 'w-64')
        )}
      >
        <div
          className={cn(
            'flex items-center h-14 px-3 border-b border-black/5 shrink-0',
            !showText && 'justify-center'
          )}
        >

{showText && (
  <img
    src={logoImg}
    alt="Blinkus"
    onClick={() => {
      navigate('/');
      onClose?.(); 
    }}
    className="cursor-pointer h-10 flex-1 object-contain object-left"
  />
)}
          {isMobile ? (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
            >
              <X size={18} className="text-black/50" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={cn('p-1.5 rounded-lg hover:bg-black/5 transition-colors', !showText && 'mx-auto')}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed
                ? <PanelLeftOpen  size={17} className="text-black/50" />
                : <PanelLeftClose size={17} className="text-black/50" />
              }
            </button>
          )}
        </div>

        <div className={cn('p-3 shrink-0', !showText && 'flex justify-center')}>
          <button
            type="button"
            onClick={() => { dispatch(clearChat()); navigate('/chat/new'); onClose?.(); }}
            title={!showText ? 'New Chat' : undefined}
            className={cn(
              'bg-accent hover:bg-accent/90 active:scale-95 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-all',
              showText ? 'w-full py-2.5 px-3' : 'w-10 h-10'
            )}
          >
            <Plus size={16} />
            {showText && 'New Chat'}
          </button>
        </div>

        <nav className="flex-1 px-2 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/10">
          <DashboardNav />
          <ChatNav />
          <TradeNav />
          <ComingSoonSidebarGroup />
          <SettingsNav />
        </nav>

        <UserNav />
      </div>
    </SidebarCtx.Provider>
  );
}

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
  return (
    <>
      <aside className="hidden md:block h-screen sticky top-0 shrink-0 z-30">
        <SidebarInner
          isCollapsed={collapsed}
          isMobile={false}
          onToggleCollapse={onToggleCollapse}
          onClose={onClose}
        />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <SidebarInner
                isCollapsed={false}
                isMobile={true}
                onToggleCollapse={onToggleCollapse}
                onClose={onClose}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
