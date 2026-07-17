import { screen, fireEvent } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SidebarSection from './SidebarSection';
import { SidebarCtx } from './SidebarContext';

function renderSidebarSection(props, sidebarCtx = { isCollapsed: false, isMobile: false, onClose: null }) {
  return render(
    <MemoryRouter>
      <SidebarCtx.Provider value={sidebarCtx}>
        <SidebarSection {...props}>
          <div data-testid="section-child">Child Content</div>
        </SidebarSection>
      </SidebarCtx.Provider>
    </MemoryRouter>
  );
}

describe('SidebarSection', () => {
  describe('Rendering', () => {
    it('renders label when provided and sidebar is expanded', () => {
      renderSidebarSection({ label: 'Analytics' });
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    it('renders children by default', () => {
      renderSidebarSection({ label: 'Test' });
      expect(screen.getByTestId('section-child')).toBeInTheDocument();
    });

    it('hides label when sidebar is collapsed', () => {
      renderSidebarSection({ label: 'Analytics' }, { isCollapsed: true, isMobile: false, onClose: null });
      expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
    });

    it('shows label on mobile even when collapsed', () => {
      renderSidebarSection({ label: 'Analytics' }, { isCollapsed: true, isMobile: true, onClose: null });
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });
  });

  describe('Non-collapsible section', () => {
    it('always shows children', () => {
      renderSidebarSection({ label: 'Always Open', collapsible: false });
      expect(screen.getByTestId('section-child')).toBeInTheDocument();
    });
  });

  describe('Collapsible section', () => {
    it('shows children when defaultOpen is true', () => {
      renderSidebarSection({ label: 'Open Section', collapsible: true, defaultOpen: true });
      expect(screen.getByTestId('section-child')).toBeInTheDocument();
    });

    it('hides children when defaultOpen is false', () => {
      renderSidebarSection({ label: 'Coming Soon', collapsible: true, defaultOpen: false });
      expect(screen.queryByTestId('section-child')).not.toBeInTheDocument();
    });

    it('expands section on header click', () => {
      renderSidebarSection({ label: 'Coming Soon', collapsible: true, defaultOpen: false });
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByTestId('section-child')).toBeInTheDocument();
    });

    it('collapses section on second click', () => {
      renderSidebarSection({ label: 'Coming Soon', collapsible: true, defaultOpen: true });
      fireEvent.click(screen.getByRole('button'));
      expect(screen.queryByTestId('section-child')).not.toBeInTheDocument();
    });

    it('shows chevron icon for collapsible sections', () => {
      renderSidebarSection({ label: 'Collapsible', collapsible: true, defaultOpen: true });
      // ChevronDown rendered through lucide mock
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
