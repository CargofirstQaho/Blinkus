import { NavLink } from 'react-router-dom';
import { useSidebar } from './SidebarContext';
import { cn } from '../../../lib/utils';


export default function NavItem({ to, icon: Icon, label, badge, end = false, onClick }) {
  const { isCollapsed, isMobile, onClose } = useSidebar();
  const showText = !isCollapsed || isMobile;

  const handleClick = () => {
    onClick?.();
    onClose?.();
  };

  return (
    <NavLink
      to={to}
      end={end}
      onClick={handleClick}
      title={!showText ? label : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl text-sm font-medium transition-all',
          showText ? 'px-3 py-2.5' : 'justify-center p-2.5',
          isActive
            ? 'bg-accent text-white shadow-sm shadow-accent/20'
            : 'text-black/60 hover:bg-black/5 hover:text-black'
        )
      }
    >
      <Icon size={18} className="shrink-0" />
      {showText && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge != null && (
            <span className="text-[10px] font-bold bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
