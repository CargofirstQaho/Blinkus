import { screen, fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import NavItem from './NavItem';
import { SidebarCtx } from './SidebarContext';

function renderNavItem(props, sidebarCtx = { isCollapsed: false, isMobile: false, onClose: null }, initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SidebarCtx.Provider value={sidebarCtx}>
        <Routes>
          <Route path="*" element={<NavItem to="/trade/domestic/purchase-order" icon={ClipboardList} label="Purchase Order" {...props} />} />
        </Routes>
      </SidebarCtx.Provider>
    </MemoryRouter>,
  );
}

describe('NavItem', () => {
  it('renders the label and links to the given path', () => {
    renderNavItem();

    const link = screen.getByRole('link', { name: /purchase order/i });
    expect(link).toHaveAttribute('href', '/trade/domestic/purchase-order');
  });

  it('renders a badge when provided', () => {
    renderNavItem({ badge: 'New' });

    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('hides the label when the sidebar is collapsed on desktop', () => {
    renderNavItem({}, { isCollapsed: true, isMobile: false, onClose: null });

    expect(screen.queryByText('Purchase Order')).not.toBeInTheDocument();
  });

  it('shows the label on mobile even when the sidebar is collapsed', () => {
    renderNavItem({}, { isCollapsed: true, isMobile: true, onClose: null });

    expect(screen.getByText('Purchase Order')).toBeInTheDocument();
  });

  it('calls onClick and onClose when clicked', () => {
    const onClick = jest.fn();
    const onClose = jest.fn();

    renderNavItem({ onClick }, { isCollapsed: false, isMobile: false, onClose });

    fireEvent.click(screen.getByRole('link', { name: /purchase order/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
