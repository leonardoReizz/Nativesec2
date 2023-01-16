import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { toastOptions } from 'renderer/utils/options/Toastify';
import * as types from './types';

export function useIPCUserConfig() {
  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.UPDATE_USER_CONFIG_RESPONSE,
      (result: types.IUpdateUserConfigResponse) => {
        console.log(result);
        if (result.message === 'ok') {
          toast.success('Configuração alterada', {
            ...toastOptions,
            toastId: 'changedSettings',
          });
        } else if (result.message !== 'ok, not callback') {
          toast.error('Erro ao alterar configuração', {
            ...toastOptions,
            toastId: 'errorChangeSettings',
          });
        }
      }
    );
  }, []);
}
