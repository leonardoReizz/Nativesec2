import { useEffect } from 'react';
import { IPCTypes } from 'renderer/@types/IPCTypes';
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
  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.DECRYPT_TEXT_RESPONSE,
      (result: IPCResponse) => {
        if (setDecryptedMessage) {
          setDecryptedMessage(result.data);
        }
      }
    );
  }, [setDecryptedMessage]);
}
