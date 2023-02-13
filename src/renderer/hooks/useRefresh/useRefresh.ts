import { IPCTypes } from '@/types/IPCTypes';
import { useEffect } from 'react';
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
}
