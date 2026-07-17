import { screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import GuestRoute from './GuestRoute';
import { createTestStore, authenticatedState, unauthenticatedState, loadingState } from '../tests/utils';

function renderGuestRoute(preloadedState) {
  const store = createTestStore(preloadedState);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>Login Page Content</div>} />
          </Route>
          <Route path="/dashboard" element={<div>Dashboard Content</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe('GuestRoute', () => {
  it('renders guest content when user is not authenticated', () => {
    renderGuestRoute(unauthenticatedState);
    expect(screen.getByText('Login Page Content')).toBeInTheDocument();
  });

  it('redirects to /dashboard when user is authenticated', () => {
    renderGuestRoute(authenticatedState);
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page Content')).not.toBeInTheDocument();
  });

  it('shows spinner while auth is not initialized', () => {
    renderGuestRoute(loadingState);
    expect(screen.queryByText('Login Page Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
  });
});
