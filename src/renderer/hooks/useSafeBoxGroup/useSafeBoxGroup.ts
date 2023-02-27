import { SafeBoxGroupContext } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { IPCTypes } from '@/types/IPCTypes';
import { useContext } from 'react';

export function useSafeBoxGroup() {
  const safeBoxGroupContext = useContext(SafeBoxGroupContext);

  async function updateSafeBoxGroup(organizationId: string) {
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.LIST_SAFE_BOX_GROUP,
      data: {
        organizationId,
      },
    });
  }

  return { ...safeBoxGroupContext, updateSafeBoxGroup };
}
