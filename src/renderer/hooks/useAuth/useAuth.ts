import { IPCTypes } from 'renderer/@types/IPCTypes';
import * as types from './types';

export function useAuth() {
  function AuthPassword({ email }: types.IAuthPasswordData) {
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.AUTH_PASSWORD,
      data: {
        email,
        type: 'login',
      },
    });
  }

  function AuthLogin({ token }: types.IAuthLoginData) {
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.AUTH_LOGIN,
      data: {
        token,
      },
    });
  }

  function ValidatePrivateKey(buff: string) {
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.VALIDATE_PRIVATE_KEY,
      data: {
        privateKey: buff,
      },
    });
  }

  return { AuthPassword, AuthLogin, ValidatePrivateKey };
}
