import { screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';
import { createTestStore, authenticatedState, unauthenticatedState, loadingState } from '../tests/utils';

function renderProtectedRoute(preloadedState) {
  const store = createTestStore(preloadedState);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Protected Dashboard Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe('ProtectedRoute', () => {
  it('renders protected content when user is authenticated', () => {
    renderProtectedRoute({
      auth: {
        ...authenticatedState.auth,
        user: { ...authenticatedState.auth.user, termsAcceptance: { accepted: true } },
      },
    });
    expect(screen.getByText('Protected Dashboard Content')).toBeInTheDocument();
  });

  it('redirects to /login when user is not authenticated', () => {
    renderProtectedRoute(unauthenticatedState);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Dashboard Content')).not.toBeInTheDocument();
  });

  it('shows spinner while auth is not initialized', () => {
    renderProtectedRoute(loadingState);
    expect(screen.queryByText('Protected Dashboard Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
