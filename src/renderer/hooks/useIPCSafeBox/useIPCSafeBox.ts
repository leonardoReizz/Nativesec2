/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from 'react';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import * as types from './types';

export function useIPCSafeBox() {
  const {
    changeCurrentSafeBox,
    currentSafeBox,
    updateSafeBoxes,
    changeSafeBoxesIsLoading,
  } = useContext(SafeBoxesContext);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.REFRESH_SAFEBOXES_RESPONSE,
      (result: types.IGetAllSafeBoxResponse) => {
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
        //changeSafeBoxesIsLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(IPCTypes.GET_SAFE_BOXES_RESPONSE, () => {
      changeSafeBoxesIsLoading(false);
      const getSafeBox = window.electron.store.get('safebox');
      if (getSafeBox !== undefined) {
        updateSafeBoxes(getSafeBox);
      }
    });
  }, []);
}
