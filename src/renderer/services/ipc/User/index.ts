import { IPCTypes } from '@/types/IPCTypes';
import * as t from './types';

export function updateUserConfigIPC(data: t.IUpdateUserRequestDTO) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.UPDATE_USER,
    data,
  });
}
