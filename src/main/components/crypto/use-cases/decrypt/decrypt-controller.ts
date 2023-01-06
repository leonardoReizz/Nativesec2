import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { IUser } from '../../../../types';
import openpgp from '../../../../crypto/openpgp';
import { store } from '../../../../main';

interface decrypt {
  message: string;
  position: string;
  name: string;
}

export class DecryptController {
  static async decrypt({ message, position, name }: decrypt) {
    console.log(message);
    const { safetyPhrase } = store.get('user') as IUser;
    const encryptedMessage = String(message);
    const decrypted = await openpgp.decrypt({
      encryptedMessage,
      passphrase: safetyPhrase,
    });

    return {
      response: IPCTypes.DECRYPT_TEXT_RESPONSE,
      data: {
        message: decrypted,
        position,
        name,
      },
    };
  }
}
