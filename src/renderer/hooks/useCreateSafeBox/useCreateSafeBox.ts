import { useEffect } from 'react';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { IPCResponse } from '../useIPCSafeBox/types';

interface UseCreateSafeBoxProps {
  setDecryptedMessage: (message: string) => void;
}

export function useCreateSafeBox({
  setDecryptedMessage,
}: UseCreateSafeBoxProps) {
  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.DECRYPT_TEXT_RESPONSE,
      (result: IPCResponse) => {
        if (setDecryptedMessage) {
          setDecryptedMessage(result.data.message);
        }
      }
    );
  }, [setDecryptedMessage]);
}
