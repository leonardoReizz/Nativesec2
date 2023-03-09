import { IPCTypes } from '@/types/IPCTypes';
import * as t from './types';

export function listSafeBoxGroupIPC(organizationId: string) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.LIST_SAFE_BOX_GROUP,
    data: {
      organizationId,
    },
  });
}

export function updateSafeBoxGroupIPC(safeBoxGroup: t.IUpdateSafeBoxGroupData) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.UPDATE_SAFE_BOX_GROUP,
    data: safeBoxGroup,
  });
}

export function deleteSafeBoxGroupIPC(data: t.IDeleteSafeBoxGroupData) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.DELETE_SAFE_BOX_GROUP,
    data,
  });
}
