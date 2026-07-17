import { screen, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import NavSubGroup from './NavSubGroup';
import { SidebarCtx } from './SidebarContext';

function renderNavSubGroup(props, sidebarCtx = { isCollapsed: false, isMobile: false, onClose: null }, initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SidebarCtx.Provider value={sidebarCtx}>
        <NavSubGroup icon={MapPin} label="Domestic" basePath="/trade/domestic" {...props}>
          <div data-testid="subgroup-child">Child Item</div>
        </NavSubGroup>
      </SidebarCtx.Provider>
    </MemoryRouter>,
  );
}

describe('NavSubGroup', () => {
  it('renders the label', () => {
    renderNavSubGroup();
    expect(screen.getByText('Domestic')).toBeInTheDocument();
  });

  it('is collapsed by default when the current path does not match basePath', () => {
    renderNavSubGroup({}, { isCollapsed: false, isMobile: false, onClose: null }, ['/']);
    expect(screen.queryByTestId('subgroup-child')).not.toBeInTheDocument();
  });

  it('is expanded by default when the current path matches basePath', () => {
    renderNavSubGroup({}, { isCollapsed: false, isMobile: false, onClose: null }, ['/trade/domestic/purchase-order']);
    expect(screen.getByTestId('subgroup-child')).toBeInTheDocument();
  });

  it('toggles open and closed when the header is clicked', () => {
    renderNavSubGroup();

    const toggle = screen.getByRole('button', { name: 'Domestic' });

    fireEvent.click(toggle);
    expect(screen.getByTestId('subgroup-child')).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.queryByTestId('subgroup-child')).not.toBeInTheDocument();
  });

  it('hides the label and children when the sidebar is collapsed on desktop', () => {
    renderNavSubGroup({}, { isCollapsed: true, isMobile: false, onClose: null });

    expect(screen.queryByText('Domestic')).not.toBeInTheDocument();
    expect(screen.queryByTestId('subgroup-child')).not.toBeInTheDocument();
  });

  it('shows the label on mobile even when the sidebar is collapsed', () => {
    renderNavSubGroup({}, { isCollapsed: true, isMobile: true, onClose: null });

    expect(screen.getByText('Domestic')).toBeInTheDocument();
  });
});
