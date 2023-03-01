import { IPCTypes } from '@/types/IPCTypes';

export async function listSafeBoxGroupIPC(organizationId: string) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.LIST_SAFE_BOX_GROUP,
    data: {
      organizationId,
    },
  });
}
