import { LoadingContext } from '@/renderer/contexts/LoadingContext/LoadingContext';
import { SafeBoxGroupContext } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { IPCTypes } from '@/types/IPCTypes';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

export function useIPCSafeBoxGroup() {
  const { updateSafeBoxGroup } = useContext(SafeBoxGroupContext);
  const { updateLoading } = useContext(LoadingContext);
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
        updateLoading(false);
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

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.DELETE_SAFE_BOX_GROUP_RESPONSE,
      (result: IIPCResponse) => {
        toast.dismiss('deleteSafeBox');
        if (result.message === 'ok') {
          return updateSafeBoxGroup(window.electron.store.get('safeBoxGroup'));
        }
        return toast.error('Erro ao deletar grupo', {
          ...toastOptions,
          toastId: 'errorDeleteSafeBoxGroup',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.CREATE_SAFE_BOX_GROUP_RESPONSE,
      (result: IIPCResponse) => {
        toast.dismiss('createSafeBoxGroup');
        if (result.message === 'ok') {
          return updateSafeBoxGroup(window.electron.store.get('safeBoxGroup'));
        }
        return toast.error('Erro ao deletar grupo', {
          ...toastOptions,
          toastId: 'errorDeleteSafeBoxGroup',
        });
      }
    );
  }, []);
}
