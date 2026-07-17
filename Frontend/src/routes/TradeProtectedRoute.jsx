import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCanAccessErp, selectEntitlementsLoaded } from '../redux/slices/entitlementSlice';
import Spinner from '../components/ui/Spinner';

export default function TradeProtectedRoute() {
  const loaded    = useSelector(selectEntitlementsLoaded);
  const canAccess = useSelector(selectCanAccessErp);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!canAccess) {
    return <Navigate to="/trade/upgrade" replace />;
  }

  return <Outlet />;
}
