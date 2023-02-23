import { IPCTypes } from '@/types/IPCTypes';
import { useEffect } from 'react';

export interface IDecryptResponse {
  message: string;
  position: string;
  name: string;
  copy?: string;
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
      (result: IIPCResponse) => {
        if (setDecryptedMessage) {
          setDecryptedMessage(result.data);
        }
      }
    );
  }, [setDecryptedMessage]);
}
