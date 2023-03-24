import { IPCTypes } from '@/types/IPCTypes';
import * as t from './types';

export function decryptMessageIPC(data: t.IDecryptData) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.DECRYPT_TEXT,
    data: { ...data },
  });
}
