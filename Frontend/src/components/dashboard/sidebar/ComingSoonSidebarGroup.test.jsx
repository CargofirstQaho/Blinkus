import { screen, fireEvent } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ComingSoonSidebarGroup from './ComingSoonSidebarGroup';
import { SidebarCtx } from './SidebarContext';
import { createTestStore } from '../../../tests/utils';

function renderComingSoonGroup(sidebarCtx = { isCollapsed: false, isMobile: false, onClose: null }) {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <SidebarCtx.Provider value={sidebarCtx}>
          <ComingSoonSidebarGroup />
        </SidebarCtx.Provider>
      </MemoryRouter>
    </Provider>
  );
}

describe('ComingSoonSidebarGroup', () => {
  describe('Rendering', () => {
    it('renders the Coming Soon label', () => {
      renderComingSoonGroup();
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });

    it('coming soon section is collapsed by default', () => {
      renderComingSoonGroup();
      expect(screen.queryByText('All Modules')).not.toBeInTheDocument();
    });

    it('expands when Coming Soon header is clicked', () => {
      renderComingSoonGroup();
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('All Modules')).toBeInTheDocument();
    });

    it('collapses back on second click', () => {
      renderComingSoonGroup();
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('All Modules')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button'));
      expect(screen.queryByText('All Modules')).not.toBeInTheDocument();
    });

    it('renders Credibility nav item after expansion', () => {
      renderComingSoonGroup();
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Credibility')).toBeInTheDocument();
    });

    it('does not render Contract Drafting nav item after expansion', () => {
      renderComingSoonGroup();
      fireEvent.click(screen.getByRole('button'));
      expect(screen.queryByText('Contract Drafting')).not.toBeInTheDocument();
    });
  });
});
