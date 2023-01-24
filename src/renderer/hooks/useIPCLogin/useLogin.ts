/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { AuthStateType } from 'renderer/pages/Auth';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { IPCResponse } from '../useIPCSafeBox/types';

interface UseIPCLoginProps {
  changeButtonIsLoading: (isLoading: boolean) => void;
  changeAuthState: (state: AuthStateType) => void;
}

export function useIPCLogin({
  changeButtonIsLoading,
  changeAuthState,
}: UseIPCLoginProps) {
  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.AUTH_PASSWORD_RESPONSE,
      (result: IPCResponse) => {
        console.log(result);
        if (result.message === 'ok') {
          toast.info('Um Token de acesso foi enviado para seu email', {
            ...toastOptions,
            toastId: 'sendToken',
          });
          changeButtonIsLoading(false);
          changeAuthState('token');
        } else {
          changeButtonIsLoading(false);
          toast.error('Email Invalido, tente novamente.', {
            ...toastOptions,
            toastId: 'invalid-email',
          });
        }
      }
    );
  }, []);
}
