import { useEffect, useState } from 'react';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { useOrganization } from '../useOrganization/useOrganization';
import { useUserConfig } from '../useUserConfig/useUserConfig';

export function useRefresh() {
  const [seconds, setSeconds] = useState<number>(0);
  const { currentOrganization } = useOrganization();
  const { refreshTime } = useUserConfig();

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
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
      setSeconds(0);
    }
  }, [seconds]);

  console.log('seconds: ', refreshTime - seconds);
}
