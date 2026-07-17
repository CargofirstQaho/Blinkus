import { Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../../../components/dashboard/sidebar/SidebarContext';
import { cn } from '../../../../lib/utils';

export default function LockedNavItem({ icon: Icon, label }) {
  const { isCollapsed, isMobile, onClose } = useSidebar();
  const navigate = useNavigate();
  const showText = !isCollapsed || isMobile;

  const handleClick = () => {
    onClose?.();
    navigate('/trade/upgrade');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={!showText ? label : undefined}
      className={cn(
        'w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all',
        showText ? 'px-3 py-2.5' : 'justify-center p-2.5',
        'text-black/40 hover:bg-black/5 hover:text-black/60 cursor-pointer'
      )}
    >
      <Icon size={18} className="shrink-0" />
      {showText && (
        <>
          <span className="flex-1 truncate text-left">{label}</span>
          <Crown size={12} className="shrink-0 opacity-50" />
        </>
      )}
    </button>
  );
}
