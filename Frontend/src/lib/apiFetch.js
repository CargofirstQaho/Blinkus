import { store, resetState } from '../redux/store';
import { clearUser } from '../redux/slices/authSlice';
import { clearEntitlements } from '../redux/slices/entitlementSlice';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

let _inflightRefresh = null;

async function doRefresh() {
  if (_inflightRefresh) return _inflightRefresh;
  _inflightRefresh = fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => { _inflightRefresh = null; });
  return _inflightRefresh;
}

export class SessionExpiredError extends Error {
  constructor() {
    super('session_expired');
    this.name = 'SessionExpiredError';
  }
}

export async function apiFetch(url, options = {}) {
  const buildOpts = () => ({
    ...options,
    headers: { ...options.headers },
    credentials: 'include',
  });

  let res = await fetch(url, buildOpts());

  if (res.status !== 401) return res;

  const refreshed = await doRefresh();
  if (!refreshed) {
    store.dispatch(clearUser());
    store.dispatch(clearEntitlements());
    store.dispatch(resetState());
    toast.error('Session expired. Please sign in again.');
    throw new SessionExpiredError();
  }

  return fetch(url, buildOpts());
}
