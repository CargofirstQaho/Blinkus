import { createContext, useContext } from 'react';

export const SidebarCtx = createContext({
  isCollapsed: false,
  isMobile: false,
  onClose: null,
});

export const useSidebar = () => useContext(SidebarCtx);
