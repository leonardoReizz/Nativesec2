import { useContext } from 'react';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import * as types from './types';

export function useSafeBox() {
  const { changeSafeBoxesIsLoading } = useContext(SafeBoxesContext);
  function getSafeBoxes(organizationId: string) {
    changeSafeBoxesIsLoading(true);
    window.electron.ipcRenderer.sendMessage('getSafeBoxes', {
      organizationId,
    });
  }

  function deleteSafeBox({ organizationId, safeBoxId }: types.IDeleteSafeBox) {
    changeSafeBoxesIsLoading(true);
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.DELETE_SAFE_BOX,
      data: {
        organizationId,
        safeBoxId,
      },
    });
  }

  return { getSafeBoxes, deleteSafeBox };
}
