import openpgp from '@/main/crypto/openpgp';
import { store } from '@/main/main';
import { IUser } from '@/main/types';
import { IPCTypes } from '@/types/IPCTypes';

interface decrypt {
  message: string;
  position: string;
  name: string;
  copy?: boolean;
}

export class DecryptController {
  async handle({ message, position, name, copy }: decrypt) {
    const { safetyPhrase } = store.get('user') as IUser;
    const encryptedMessage = String(message);
    const decrypted = await openpgp.decrypt({
      encryptedMessage,
      passphrase: safetyPhrase,
    });

    return {
      response: IPCTypes.DECRYPT_TEXT_RESPONSE,
      data: {
        status: 'ok',
        data: {
          message: decrypted,
          position,
          name,
          copy,
        },
      },
    };
  }
}
