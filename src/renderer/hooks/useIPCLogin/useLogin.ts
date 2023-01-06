/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { IIPCResponse } from 'renderer/@types/types';
import { AuthStateType } from 'renderer/pages/Auth';
import { toastOptions } from 'renderer/utils/options/Toastify';

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
      (arg: IIPCResponse) => {
        switch (arg.status) {
          case 200:
            if (arg.data?.status === 'ok') {
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
            break;
          default:
            toast.error('Error, tente novamente.', {
              ...toastOptions,
              toastId: 'error-token',
            });
            break;
        }
      }
    );
  }, []);
}
