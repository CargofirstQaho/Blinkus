import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthInitialized } from '../redux/slices/authSlice';
import Spinner from '../components/ui/Spinner';

export default function GuestRoute() {
  const initialized     = useSelector(selectAuthInitialized);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!initialized) return <Spinner fullScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
