import { useSelector } from 'react-redux';
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthInitialized,
} from '../redux/slices/authSlice';

export function useAuth() {
  return {
    user:            useSelector(selectUser),
    isAuthenticated: useSelector(selectIsAuthenticated),
    authLoading:     useSelector(selectAuthLoading),
    initialized:     useSelector(selectAuthInitialized),
  };
}
