import { useEffect } from 'react';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { useOrganization } from '../useOrganization/useOrganization';
import { useUserConfig } from '../useUserConfig/useUserConfig';

export function useRefresh() {
  const { currentOrganization } = useOrganization();
  const { refreshTime } = useUserConfig();

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentOrganization) {
        window.electron.ipcRenderer.sendMessage('useIPC', {
          event: IPCTypes.LIST_MY_INVITES,
        });
        window.electron.ipcRenderer.sendMessage('useIPC', {
          event: IPCTypes.REFRESH_SAFE_BOXES,
          data: {
            organizationId: currentOrganization._id,
          },
        });
        window.electron.ipcRenderer.sendMessage('useIPC', {
          event: IPCTypes.REFRESH_ALL_ORGANIZATIONS,
          data: {
            organizationId: currentOrganization._id,
          },
        });
      }
    }, refreshTime * 1000);

    return () => clearInterval(interval);
  }, [refreshTime, currentOrganization]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     //     if (window.electron.store.get('initialData')?.updateAvaliable === true) {
  //     //       // updateNotifications([{
  //     //       //   type: 'updateNativeSec',
  //     //       //   message: 'Nova versão do nativesec instalada.',
  //     //       //   type: 'updateNativeSec' | 'inviteOrganization';
  //     //       //   message: string;
  //     //       //   organizationId?: string;
  //     //       // }]);
  //     //     }
  //   }, refreshTime * 1000);

  //   return () => clearInterval(interval);
  // }, [refreshTime, currentOrganization]);
}
