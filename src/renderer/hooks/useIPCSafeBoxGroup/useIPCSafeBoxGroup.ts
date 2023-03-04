import { SafeBoxGroupContext } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { IPCTypes } from '@/types/IPCTypes';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

export function useIPCSafeBoxGroup() {
  const { updateSafeBoxGroup } = useContext(SafeBoxGroupContext);
  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.LIST_SAFE_BOX_GROUP_RESPONSE,
      (result: IIPCResponse) => {
        if (result.message === 'ok') {
          return updateSafeBoxGroup(window.electron.store.get('safeBoxGroup'));
        }
        return toast.error('Erro ao listar grupos', {
          ...toastOptions,
          toastId: 'errorListSafeBoxGroup',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.UPDATE_SAFE_BOX_GROUP_RESPONSE,
      (result: IIPCResponse) => {
        toast.dismiss('updateSafeBoxGroup');
        if (result.message === 'ok') {
          return updateSafeBoxGroup(window.electron.store.get('safeBoxGroup'));
        }
        return toast.error('Erro ao atualizar grupo', {
          ...toastOptions,
          toastId: 'errorListSafeBoxGroup',
        });
      }
    );
  }, []);
}
