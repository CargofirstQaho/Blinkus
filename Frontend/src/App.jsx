// import { useEffect } from 'react';
// import { RouterProvider } from 'react-router-dom';
// import { Provider, useDispatch, useSelector } from 'react-redux';
// import { store } from './redux/store';
// import {
//   setUser, clearUser, setAuthLoading, setInitialized,
//   selectAuthInitialized,
// } from './redux/slices/authSlice';
// import { router } from './routes/router';
// import Spinner from './components/ui/Spinner';

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// async function fetchMe(token) {
//   const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization:  `Bearer ${token}`,
//     },
//     credentials: 'include',
//   });
//   if (!res.ok) return null;
//   const data = await res.json().catch(() => null);
//   if (!data?.data?.user) return null;
//   return { user: data.data.user, usage: data.data.usage ?? null };
// }

// async function fetchNewToken() {
//   const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
//     method:      'POST',
//     credentials: 'include',
//   });
//   if (!res.ok) return null;
//   const data = await res.json().catch(() => null);
//   return data?.data?.token ?? null;
// }

// function AppCore() {
//   const dispatch    = useDispatch();
//   const initialized = useSelector(selectAuthInitialized);

//   useEffect(() => {
//     const restoreSession = async () => {
//       dispatch(setAuthLoading(true));

//       try {
//         let token = localStorage.getItem('blinkus_token');

//         if (token) {
//           const result = await fetchMe(token);
//           if (result) {
//             dispatch(setUser({ user: result.user, token, usage: result.usage }));
//             return;
//           }
//         }

//         const newToken = await fetchNewToken();
//         if (newToken) {
//           localStorage.setItem('blinkus_token', newToken);
//           const result = await fetchMe(newToken);
//           if (result) {
//             dispatch(setUser({ user: result.user, token: newToken, usage: result.usage }));
//             return;
//           }
//         }

//         localStorage.removeItem('blinkus_token');
//         dispatch(clearUser());
//       } catch {
//         localStorage.removeItem('blinkus_token');
//         dispatch(clearUser());
//       } finally {
//         dispatch(setAuthLoading(false));
//         dispatch(setInitialized());
//       }
//     };

//     restoreSession();
//   }, [dispatch]);

//   if (!initialized) return <Spinner fullScreen />;

//   return <RouterProvider router={router} />;
// }

// export default function App() {
//   return (
//     <Provider store={store}>
//       <AppCore />
//     </Provider>
//   );
// }










import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import ReactGA from 'react-ga4';

import { store } from './redux/store';

import {
  setUser,
  clearUser,
  setAuthLoading,
  setInitialized,
  selectAuthInitialized,
  selectIsAuthenticated,
  selectTermsAccepted,
} from './redux/slices/authSlice';
import { fetchChatHistory } from './redux/slices/chatHistorySlice';
import { clearEntitlements } from './redux/slices/entitlementSlice';

import { router } from './routes/router';
import Spinner from './components/ui/Spinner';
import VersionChecker from './components/common/VersionChecker';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Google Analytics Initialize
ReactGA.initialize('G-9J495WN00F');

async function fetchMe() {
  const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) return null;

  const data = await res.json().catch(() => null);

  if (!data?.data?.user) return null;

  return {
    user: data.data.user,
    usage: data.data.usage ?? null,
  };
}

async function refreshSession() {
  const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  return res.ok;
}

function AppCore() {
  const dispatch = useDispatch();
  const initialized = useSelector(selectAuthInitialized);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const termsAccepted = useSelector(selectTermsAccepted);

  // Google Analytics Page Tracking
  useEffect(() => {
    const trackPage = () => {
      ReactGA.send({
        hitType: 'pageview',
        page: window.location.pathname + window.location.search,
      });
    };

    // Initial page load
    trackPage();

    // Track browser navigation
    window.addEventListener('popstate', trackPage);

    return () => {
      window.removeEventListener('popstate', trackPage);
    };
  }, []);

  // Restore User Session
  useEffect(() => {
    const restoreSession = async () => {
      dispatch(setAuthLoading(true));

      try {
        const result = await fetchMe();

        if (result) {
          dispatch(
            setUser({
              user: result.user,
              usage: result.usage,
            })
          );

          return;
        }

        const refreshed = await refreshSession();

        if (refreshed) {
          const retryResult = await fetchMe();

          if (retryResult) {
            dispatch(
              setUser({
                user: retryResult.user,
                usage: retryResult.usage,
              })
            );

            return;
          }
        }

        dispatch(clearUser());
        dispatch(clearEntitlements());
      } catch {
        dispatch(clearUser());
        dispatch(clearEntitlements());
      } finally {
        dispatch(setAuthLoading(false));
        dispatch(setInitialized());
      }
    };

    restoreSession();
  }, [dispatch]);

  // Hydrate Chat History (global, available regardless of current page)
  useEffect(() => {
    if (initialized && isAuthenticated && termsAccepted) {
      dispatch(fetchChatHistory());
    }
  }, [initialized, isAuthenticated, termsAccepted, dispatch]);

  if (!initialized) return <Spinner fullScreen />;

  return (
    <>
      <RouterProvider router={router} />
      <VersionChecker />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppCore />
    </Provider>
  );
}