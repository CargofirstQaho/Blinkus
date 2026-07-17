import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthInitialized, selectTermsAccepted } from '../redux/slices/authSlice';
import Spinner from '../components/ui/Spinner';

export default function ProtectedRoute() {
  const initialized     = useSelector(selectAuthInitialized);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const termsAccepted   = useSelector(selectTermsAccepted);
  const location        = useLocation();

  if (!initialized) return <Spinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!termsAccepted && location.pathname !== '/consent') return <Navigate to="/consent" replace />;
  if (termsAccepted && location.pathname === '/consent') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
