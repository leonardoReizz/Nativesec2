import { IPCTypes } from '@/types/IPCTypes';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toastOptions } from 'renderer/utils/options/Toastify';

export function useSession() {
  const navigate = useNavigate();
  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.SESSION_EXPIRED,
      (response: IIPCResponse) => {
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
