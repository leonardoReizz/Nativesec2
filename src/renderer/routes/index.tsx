import { useCallback, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loading } from 'renderer/components/Loading';
import { Auth } from 'renderer/pages/Auth';
import { Home } from 'renderer/pages/Home/index';
import { UserSettings } from 'renderer/pages/UserSettings';
import { Workspace } from 'renderer/pages/Workspace';
import { LayoutsWithSidebar } from './LayoutsWithSidebar';
import { ProtectedRoutes } from './ProtectedRoutes';

export type LoadingType = 'false' | 'true' | 'finalized';

export function AppRoutes() {
  const [isLoading, setIsLoading] = useState<LoadingType>('false');

  const changeLoadingState = useCallback((state: LoadingType) => {
    setIsLoading(state);
  }, []);
  return (
    <>
      <Loading isLoading={isLoading} changeLoadingState={changeLoadingState} />

      <Routes>
        <Route
          path="/"
          element={<Auth changeLoadingState={changeLoadingState} />}
        />
        <Route element={<ProtectedRoutes />}>
          <Route element={<LayoutsWithSidebar />}>
            <Route path="/home" element={<Home />} />
            <Route path="/workspace/:id" element={<Workspace />} />
            <Route path="/userSettings" element={<UserSettings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
