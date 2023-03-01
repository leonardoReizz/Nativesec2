import { IPCTypes } from '@/types/IPCTypes';
import * as t from './types';

export function deleteSafeBox({ organizationId, safeBoxId }: t.IDeleteSafeBox) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.DELETE_SAFE_BOX,
    data: {
      organizationId,
      safeBoxId,
    },
  });
}

export function getSafeBoxes(organizationId: string) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.LIST_SAFE_BOXES,
    data: {
      organizationId,
    },
  });
}

export function forceRefreshSafeBoxes(organizationId: string) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.FORCE_REFRESH_SAFE_BOXES,
    data: { organizationId },
  });
}
