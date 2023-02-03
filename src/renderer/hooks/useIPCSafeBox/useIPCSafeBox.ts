/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { useLoading } from '../useLoading';
import { useSafeBox } from '../useSafeBox/useSafeBox';
import * as types from './types';

export function useIPCSafeBox() {
  const {
    changeCurrentSafeBox,
    currentSafeBox,
    updateSafeBoxes,
    changeSafeBoxesIsLoading,
    refreshSafeBoxes,
  } = useContext(SafeBoxesContext);

  const { changeSafeBoxMode } = useSafeBox();
  const { updateLoading } = useLoading();
  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.REFRESH_SAFEBOXES_RESPONSE,
      (result: types.IGetAllSafeBoxResponse) => {
        console.log(result, ' refresh');
        if (result.safeBoxResponse) {
          updateSafeBoxes(window.electron.store.get('safebox'));
          if (currentSafeBox !== undefined) {
            const safeBoxes = window.electron.store.get(
              'safeBox'
            ) as ISafeBox[];
            const filter = safeBoxes.filter(
              (safebox) => safebox._id === currentSafeBox._id
            );
            changeCurrentSafeBox(filter[0]);
          }
        }
        // changeSafeBoxesIsLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.UPDATE_USERS_SAFE_BOX_RESPONSE,
      (result: types.IUpdateUsersSafeBoxResponse) => {
        if (result.message === 'ok') {
          toast.success('Usuario removido', {
            ...toastOptions,
            toastId: 'userRemoved',
          });
          updateSafeBoxes(window.electron.store.get('safebox'));

          const safeBoxes = window.electron.store.get('safebox') as ISafeBox[];
          console.log(safeBoxes, ' safeBoxes');

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
      (response: types.IPCResponse) => {
        if (response.message === 'ok') {
          updateSafeBoxes(window.electron.store.get('safebox'));
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
  });

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.DELETE_SAFE_BOX_RESPONSE,
      (response: types.IPCResponse) => {
        if (response.message === 'ok') {
          updateSafeBoxes(window.electron.store.get('safebox'));
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
          updateSafeBoxes(window.electron.store.get('safebox'));

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
      IPCTypes.GET_SAFE_BOXES_RESPONSE,
      (result: types.IPCResponse) => {
        console.log(result);
        changeSafeBoxesIsLoading(false);
        if (result.message === 'ok') {
          return updateSafeBoxes(window.electron.store.get('safebox'));
        }

        return toast.error('Erro ao listar cofres', {
          ...toastOptions,
          toastId: 'errorListSafeBox',
        });
        // const getSafeBox = window.electron.store.get('safebox');
        // if (getSafeBox !== undefined) {
        //   updateSafeBoxes(getSafeBox);
        // }
      }
    );
  }, []);

  useEffect(() => {
    if (currentSafeBox?._id !== undefined) {
      window.electron.ipcRenderer.on(
        IPCTypes.UPDATE_SAFE_BOX_RESPONSE,
        (response: types.IPCResponse) => {
          toast.dismiss('updateSafeBox');
          if (response.message === 'ok') {
            toast.success('Cofre Atualizado', {
              ...toastOptions,
              toastId: 'updatedSafeBox',
            });

            refreshSafeBoxes();
            changeSafeBoxMode('view');

            const safeBoxes = window.electron.store.get(
              'safebox'
            ) as ISafeBox[];
            const filter = safeBoxes.filter(
              (safebox) => safebox._id === currentSafeBox?._id
            );

            changeCurrentSafeBox(filter[0]);
          }
        }
      );
    }
  }, [currentSafeBox]);
}
