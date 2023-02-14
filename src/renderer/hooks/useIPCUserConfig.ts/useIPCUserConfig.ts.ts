import { IPCTypes } from '@/types/IPCTypes';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { useLoading } from '../useLoading';
import * as types from './types';

export function useIPCUserConfig() {
  const { updateLoading } = useLoading();
  // useEffect(() => {
  //   window.electron.ipcRenderer.on(
  //     IPCTypes.UPDATE_USER_CONFIG_RESPONSE,
  //     (result: types.IUpdateUserConfigResponse) => {
  //       if (result.message === 'ok') {
  //         toast.success('Configuração alterada', {
  //           ...toastOptions,
  //           toastId: 'changedSettings',
  //         });
  //       } else if (result.message !== 'ok, not callback') {
  //         toast.error('Erro ao alterar configuração', {
  //           ...toastOptions,
  //           toastId: 'errorChangeSettings',
  //         });
  //       }
  //     }
  //   );
  // }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.CHANGE_SAFETY_PHRASE_RESPONSE,
      (result: types.IUpdateUserConfigResponse) => {
        console.log(result, ' change safety phrase');
        if (result.message === 'ok') {
          toast.success('Senha Alterada', {
            ...toastOptions,
            toastId: 'changedSettings',
          });
          updateLoading(false);
        } else {
          toast.error('Erro ao alterar senha', {
            ...toastOptions,
            toastId: 'errorChangeSafetyPhrase',
          });
        }
      }
    );
  }, []);
}
