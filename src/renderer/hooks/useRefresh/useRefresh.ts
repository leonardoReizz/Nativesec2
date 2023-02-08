import { useEffect, useState } from 'react';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { useNotifications } from '../useNotifications/useNotifications';
import { useOrganization } from '../useOrganization/useOrganization';
import { useUserConfig } from '../useUserConfig/useUserConfig';

export function useRefresh() {
  const [seconds, setSeconds] = useState<number>(0);
  const { currentOrganization } = useOrganization();
  const { refreshTime } = useUserConfig();
  const { updateNotifications } = useNotifications();

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((state) => state + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (refreshTime - seconds <= 0) {
      if (currentOrganization) {
        window.electron.ipcRenderer.sendMessage('useIPC', {
          event: IPCTypes.REFRESH_SAFEBOXES,
          data: {
            organizationId: currentOrganization._id,
          },
        });
      }

      if (window.electron.store.get('token')?.accessToken) {
        window.electron.ipcRenderer.sendMessage('useIPC', {
          event: IPCTypes.LIST_MY_INVITES,
        });
      }

      if (window.electron.store.get('initialData')?.updateAvaliable === true) {
        updateNotifications({
          type: 'updateNativeSec',
          message: 'Nova versão do nativesec instalada.',
        });
      }
      setSeconds(0);
    }
  }, [seconds]);

  console.log('seconds: ', refreshTime - seconds);
}
