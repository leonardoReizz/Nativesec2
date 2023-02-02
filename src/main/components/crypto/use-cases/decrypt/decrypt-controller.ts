import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { IUser } from '../../../../types';
import openpgp from '../../../../crypto/openpgp';
import { store } from '../../../../main';

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
