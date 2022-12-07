import { Outlet } from 'react-router-dom';
import { Login } from 'renderer/pages/Auth/Login';

interface ProtectedRoutesProps {
  handleSetIsLoading: (loading: boolean) => void;
}

export function ProtectedRoutes() {
  const user = window.electron.store.get('token');
  return user?.accessToken ? <Outlet /> : '';
}
