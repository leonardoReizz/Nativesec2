import { Outlet } from 'react-router-dom';

export function ProtectedRoutes() {
  const user = window.electron.store.get('token');
  return user?.accessToken ? <Outlet /> : <></>;
}
