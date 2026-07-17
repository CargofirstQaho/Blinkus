import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LogOut } from 'lucide-react';
import { clearUser } from '../../../redux/slices/authSlice';
import { clearChat } from '../../../redux/slices/chatSlice';
import { useSidebar } from './SidebarContext';
import { cn } from '../../../lib/utils';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function UserNav() {
  const { isCollapsed, isMobile, onClose } = useSidebar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showText = !isCollapsed || isMobile;

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method:      'POST',
        credentials: 'include',
      });
    } catch {}
    dispatch(clearUser());
    dispatch(clearChat());
    onClose?.();
    navigate('/');
  };

  return (
    <div className={cn('p-3 border-t border-black/5 shrink-0', !showText && 'flex justify-center')}>
      {/* <button
        type="button"
        onClick={handleLogout}
        title={!showText ? 'Sign out' : undefined}
        className={cn(
          'flex items-center gap-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors',
          showText ? 'w-full px-3 py-2.5' : 'p-2.5'
        )}
      >
        <LogOut size={18} className="shrink-0" />
        {showText && <span>Sign out</span>}
      </button> */}
    </div>
  );
}
