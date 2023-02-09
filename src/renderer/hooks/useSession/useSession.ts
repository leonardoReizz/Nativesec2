import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { toastOptions } from 'renderer/utils/options/Toastify';

export function useSession() {
  const navigate = useNavigate();
  useEffect(() => {
    window.electron.ipcRenderer.on(IPCTypes.SESSION_EXPIRED, () => {
      navigate('/');
      toast.info('Sessão expirada', {
        ...toastOptions,
        toastId: 'sessionExpired',
      });
    });
  }, []);
}
