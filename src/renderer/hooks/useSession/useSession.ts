import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { IPCResponse } from '../useIPCSafeBox/types';

export function useSession() {
  const navigate = useNavigate();
  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.SESSION_EXPIRED,
      (response: IPCResponse) => {
        navigate('/');
        if (response.data.type === 'close') {
          return toast.info('Sessão encerrada', {
            ...toastOptions,
            toastId: 'sessionExpired',
          });
        }
        return toast.info('Sessão expirada', {
          ...toastOptions,
          toastId: 'sessionExpired',
        });
      }
    );
  }, []);
}
