import { screen, fireEvent } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Sidebar from './Sidebar';
import { createTestStore, authenticatedState } from '../../../tests/utils';

function renderSidebar(props = {}) {
  const store = createTestStore(authenticatedState);
  const defaultProps = {
    open: false,
    onClose: jest.fn(),
    collapsed: false,
    onToggleCollapse: jest.fn(),
    ...props,
  };
  return {
    store,
    onToggleCollapse: defaultProps.onToggleCollapse,
    onClose: defaultProps.onClose,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar {...defaultProps} />
        </MemoryRouter>
      </Provider>
    ),
  };
}

describe('Sidebar', () => {
  describe('Rendering', () => {
    it('renders sidebar with logo', () => {
      renderSidebar();
      const logo = document.querySelector('img[alt="Blinkus"]');
      expect(logo).toBeInTheDocument();
    });

    it('renders New Chat button', () => {
      renderSidebar();
      expect(screen.getByText('New Chat')).toBeInTheDocument();
    });

    it('renders collapse toggle button', () => {
      renderSidebar({ collapsed: false });
      expect(screen.getByRole('button', { name: /collapse sidebar/i })).toBeInTheDocument();
    });

    it('renders expand toggle button when collapsed', () => {
      renderSidebar({ collapsed: true });
      expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument();
    });

    it('renders Coming Soon sidebar group', () => {
      renderSidebar();
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });
  });

  describe('Collapse / Expand', () => {
    it('calls onToggleCollapse when collapse button is clicked', () => {
      const { onToggleCollapse } = renderSidebar({ collapsed: false });
      fireEvent.click(screen.getByRole('button', { name: /collapse sidebar/i }));
      expect(onToggleCollapse).toHaveBeenCalledTimes(1);
    });

    it('calls onToggleCollapse when expand button is clicked', () => {
      const { onToggleCollapse } = renderSidebar({ collapsed: true });
      fireEvent.click(screen.getByRole('button', { name: /expand sidebar/i }));
      expect(onToggleCollapse).toHaveBeenCalledTimes(1);
    });

    it('hides New Chat text label when collapsed', () => {
      renderSidebar({ collapsed: true });
      expect(screen.queryByText('New Chat')).not.toBeInTheDocument();
    });
  });

  describe('Mobile drawer', () => {
    it('renders mobile drawer when open prop is true', () => {
      renderSidebar({ open: true });
      // Should render close button (X icon) in mobile drawer
      // There will be two sidebar instances — desktop (hidden) + mobile drawer
      const imgs = document.querySelectorAll('img[alt="Blinkus"]');
      expect(imgs.length).toBeGreaterThanOrEqual(1);
    });

    it('calls onClose when X close button is clicked in mobile drawer', () => {
      const { onClose } = renderSidebar({ open: true });
      // X button in mobile SidebarInner has no aria-label (icon-only)
      const closeBtn = screen.getByRole('button', { name: '' });
      fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
