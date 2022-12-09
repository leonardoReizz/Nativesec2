import { useContext } from 'react';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';

export function useSafeBox() {
  const { changeSafeBoxesIsLoading } = useContext(SafeBoxesContext);
  function getSafeBoxes(organizationId: string) {
    changeSafeBoxesIsLoading(true);
    window.electron.ipcRenderer.sendMessage('getSafeBoxes', {
      organizationId,
    });
  }

  return { getSafeBoxes };
}
