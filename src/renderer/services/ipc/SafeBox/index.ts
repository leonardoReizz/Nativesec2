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

export function updateUsersSafeBox(safeBox: t.IUpdateUserSafeBox) {
  console.log(safeBox);
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.UPDATE_USERS_SAFE_BOX,
    data: safeBox,
  });
}

export function addSafeBoxUsersIPC(safeBox: t.IAddSafeBoxUsersIPC) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.ADD_SAFE_BOX_USERS,
    data: safeBox,
  });
}
