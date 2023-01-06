import { useContext, useEffect } from 'react';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { SafeBoxModeContext } from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import { IPCResponse } from '../useIPCSafeBox/types';

export interface IDecryptResponse {
  message: string;
  position: string;
  name: string;
}

interface UseCreateSafeBoxProps {
  setDecryptedMessage: (message: IDecryptResponse) => void;
}

export function useCreateSafeBox({
  setDecryptedMessage,
}: UseCreateSafeBoxProps) {
  const { refreshSafeBoxes } = useContext(SafeBoxesContext);
  const { changeSafeBoxMode } = useContext(SafeBoxModeContext);
  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.DECRYPT_TEXT_RESPONSE,
      (result: IPCResponse) => {
        if (setDecryptedMessage) {
          setDecryptedMessage(result);
        }
      }
    );
  }, [setDecryptedMessage]);
}
