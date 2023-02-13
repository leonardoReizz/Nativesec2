import { useCallback, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ForceLoading } from 'renderer/components/ForceLoading';
import { Loading } from 'renderer/components/Loading';
import { useIPCAuth } from 'renderer/hooks/useIPCAuth/useIPCAuth';
import { useIpcOrganization } from 'renderer/hooks/useIPCOrganizations/useIpcOrganizations';
import { useIPCSafeBox } from 'renderer/hooks/useIPCSafeBox/useIPCSafeBox';
import { useLoading } from 'renderer/hooks/useLoading';
import { useRefresh } from 'renderer/hooks/useRefresh/useRefresh';
import { useSession } from 'renderer/hooks/useSession/useSession';
import { Auth, AuthStateType } from 'renderer/pages/Auth';
import { CreateOrganization } from 'renderer/pages/CreateOrganization';
import { Home } from 'renderer/pages/Home/index';
import { UserSettings } from 'renderer/pages/UserSettings';
import { Workspace } from 'renderer/pages/Workspace';
import { WorkspaceMembers } from 'renderer/pages/WorkspaceMembers';
import { WorkspaceSettings } from 'renderer/pages/WorkspaceSettings';
import { LayoutsWithSidebar } from './LayoutsWithSidebar';
import { ProtectedRoutes } from './ProtectedRoutes';

export type LoadingType = 'false' | 'true' | 'finalized';

export function AppRoutes() {
  const [authState, setAuthState] = useState<AuthStateType>('login-step-one');
  const { forceLoading } = useLoading();
  const handleAuthState = useCallback((state: AuthStateType) => {
    toast.dismiss('resendToken');
    setAuthState(state);
  }, []);
  const [isLoading, setIsLoading] = useState<LoadingType>('false');

  const changeLoadingState = useCallback((state: LoadingType) => {
    setIsLoading(state);
  }, []);

  useIpcOrganization();
  useIPCSafeBox();
  useRefresh();
  useSession();

  useIPCAuth({ changeAuthState: handleAuthState, changeLoadingState });

  return (
    <>
      <Loading isLoading={isLoading} changeLoadingState={changeLoadingState} />
      {forceLoading && <ForceLoading isLoading={forceLoading} />}
      <Routes>
        <Route
          path="/"
          element={
            <Auth
              changeLoadingState={changeLoadingState}
              handleAuthState={handleAuthState}
              authState={authState}
            />
          }
        />
        <Route element={<ProtectedRoutes />}>
          <Route element={<LayoutsWithSidebar />}>
            <Route path="/home" element={<Home />} />
            <Route path="/workspace/:id" element={<Workspace />} />
            <Route path="/userSettings" element={<UserSettings />} />
            <Route
              path="/createOrganization"
              element={<CreateOrganization />}
            />
            <Route path="/organizationMembers" element={<WorkspaceMembers />} />
            <Route
              path="/organizationSettings"
              element={<WorkspaceSettings />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
