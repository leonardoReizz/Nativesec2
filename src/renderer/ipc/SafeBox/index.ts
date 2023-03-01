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
