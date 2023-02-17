/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { IPCTypes } from '@/types/IPCTypes';
import { SafeBoxDatabaseModel } from 'main/components/safe-box/model/SafeBox';
import { useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { useLoading } from '../useLoading';
import { useSafeBox } from '../useSafeBox/useSafeBox';
import * as types from './types';

export function useIPCSafeBox() {
  const {
    changeCurrentSafeBox,
    updateSafeBoxes,
    changeSafeBoxesIsLoading,
    refreshSafeBoxes,
  } = useContext(SafeBoxesContext);

  const { changeSafeBoxMode } = useSafeBox();
  const { updateLoading, updateForceLoading } = useLoading();

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.UPDATE_USERS_SAFE_BOX_RESPONSE,
      (result: types.IUpdateUsersSafeBoxResponse) => {
        toast.dismiss('updateSafeBox');
        if (result.message === 'ok') {
          toast.success('Usuario alterado', {
            ...toastOptions,
            toastId: 'userRemoved',
          });
          updateSafeBoxes(window.electron.store.get('safebox'));

          const safeBoxes = window.electron.store.get('safebox') as ISafeBox[];

          const filter = safeBoxes.filter(
            (safebox) => safebox._id === result.data.safeBoxId
          );

          updateLoading(false);
          changeCurrentSafeBox({ ...filter[0] });
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.CREATE_SAFE_BOX_RESPONSE,
      (response: IIPCResponse) => {
        toast.dismiss('saveSafeBox');
        updateLoading(false);
        if (response.message === 'ok') {
          updateSafeBoxes(window.electron.store.get('safebox'));

          const safeboxes: SafeBoxDatabaseModel[] =
            window.electron.store.get('safebox');

          const newCurrentSafeBox = safeboxes.filter(
            (safeBox) => safeBox._id === response.data.safeBoxId
          );

          if (newCurrentSafeBox[0]) {
            changeCurrentSafeBox(newCurrentSafeBox[0]);
          }
          return toast.success('Cofre criado com sucesso', {
            ...toastOptions,
            toastId: 'createdSucess',
          });
        }
        return toast.error('Erro ao criar cofre', {
          ...toastOptions,
          toastId: 'createdError',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.DELETE_SAFE_BOX_RESPONSE,
      (response: IIPCResponse) => {
        updateLoading(false);
        if (response.message === 'ok') {
          changeCurrentSafeBox(undefined);
          refreshSafeBoxes();
          return toast.success('Cofre deletado.', {
            ...toastOptions,
            toastId: 'deletedSafeBox',
          });
        }
        return toast.error('Erro ao deletar cofre', {
          ...toastOptions,
          toastId: 'deletedSafeBoxError',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.ADD_SAFE_BOX_USERS_RESPONSE,
      (response: types.IAddSafeBoxUsersResponse) => {
        toast.dismiss('updateSafeBox');
        if (response.message === 'ok') {
          refreshSafeBoxes();
          const safeBoxes = window.electron.store.get('safebox') as ISafeBox[];
          const filter = safeBoxes.filter(
            (safebox) => safebox._id === response.data.safeBoxId
          );

          changeCurrentSafeBox({ ...filter[0] });
          updateLoading(false);

          return toast.success('Usuarios Atualizados', {
            ...toastOptions,
            toastId: 'deletedSafeBox',
          });
        }
        return toast.error('Erro ao atualizar usuarios', {
          ...toastOptions,
          toastId: 'deletedSafeBoxError',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.LIST_SAFE_BOXES_RESPONSE,
      (result: IIPCResponse) => {
        changeSafeBoxesIsLoading(false);
        if (result.message === 'ok') {
          return refreshSafeBoxes();
        }

        return toast.error('Erro ao listar cofres', {
          ...toastOptions,
          toastId: 'errorListSafeBox',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.UPDATE_SAFE_BOX_RESPONSE,
      (response: types.IUpdateSafeBoxResponse) => {
        toast.dismiss('saveSafeBox');
        if (response.message === 'ok') {
          toast.success('Cofre Atualizado', {
            ...toastOptions,
            toastId: 'updatedSafeBox',
          });

          refreshSafeBoxes();
          changeSafeBoxMode('view');
          const safeBoxes = window.electron.store.get('safebox') as ISafeBox[];
          const filter = safeBoxes.filter(
            (safebox) => safebox._id === response.data.safeBoxId
          );

          changeCurrentSafeBox(filter[0]);
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.FORCE_REFRESH_SAFE_BOXES_RESPONSE,
      (response: IIPCResponse) => {
        updateForceLoading(false);
        if (response.message === 'ok') {
          refreshSafeBoxes();
          return toast.success('Cofres atualizados', {
            ...toastOptions,
            toastId: 'forceUpdateSuccess',
          });
        }
        return toast.error('Erro ao atualizar cofres', {
          ...toastOptions,
          toastId: 'errorForceUpdate',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.REFRESH_SAFE_BOXES_RESPONSE,
      (response: IIPCResponse) => {
        if (response.message === 'ok') {
          if (response.data.safeBoxResponse) refreshSafeBoxes();

          if (response.data.safeBoxId) {
            const safeBoxes = window.electron.store.get(
              'safebox'
            ) as ISafeBox[];

            const filter = safeBoxes.filter(
              (safeBox) => safeBox._id === response.data.safeBoxId
            );
            if (filter.length === 0) {
              changeCurrentSafeBox(undefined);
            }
          }

          return null;
        }

        return toast.error('Erro ao atualizar cofres', {
          ...toastOptions,
          toastId: 'errorRefreshSafeBoxes',
        });
      }
    );
  }, []);
}
