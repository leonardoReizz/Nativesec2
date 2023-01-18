import { useCallback, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loading } from 'renderer/components/Loading';
import { useIpcOrganization } from 'renderer/hooks/useIPCOrganizations/useIpcOrganizations';
import { Auth } from 'renderer/pages/Auth';
import { CreateOrganization } from 'renderer/pages/CreateOrganization';
import { Home } from 'renderer/pages/Home/index';
import { UserSettings } from 'renderer/pages/UserSettings';
import { Workspace } from 'renderer/pages/Workspace';
import { WorkspaceSettings } from 'renderer/pages/WorkspaceSettings';
import { LayoutsWithSidebar } from './LayoutsWithSidebar';
import { ProtectedRoutes } from './ProtectedRoutes';

export type LoadingType = 'false' | 'true' | 'finalized';

export function AppRoutes() {
  useIpcOrganization();
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
            <Route path="/workspaceSettings" element={<WorkspaceSettings />} />
            <Route path="/userSettings" element={<UserSettings />} />
            <Route
              path="/createOrganization"
              element={<CreateOrganization />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
