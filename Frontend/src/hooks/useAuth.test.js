import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useAuth } from './useAuth';
import { createTestStore, authenticatedState, unauthenticatedState, loadingState } from '../tests/utils';

function wrapperFor(store) {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

describe('useAuth', () => {
  it('returns user and auth flags for an authenticated user', () => {
    const store = createTestStore(authenticatedState);
    const { result } = renderHook(() => useAuth(), { wrapper: wrapperFor(store) });

    expect(result.current.user).toEqual(authenticatedState.auth.user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.authLoading).toBe(false);
    expect(result.current.initialized).toBe(true);
  });

  it('returns null user for an unauthenticated user', () => {
    const store = createTestStore(unauthenticatedState);
    const { result } = renderHook(() => useAuth(), { wrapper: wrapperFor(store) });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('reflects loading state while auth is initializing', () => {
    const store = createTestStore(loadingState);
    const { result } = renderHook(() => useAuth(), { wrapper: wrapperFor(store) });

    expect(result.current.authLoading).toBe(true);
    expect(result.current.initialized).toBe(false);
  });
});
