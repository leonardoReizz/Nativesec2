import { IpcMainEvent } from 'electron';
import { IPCTypes } from '../../../renderer/@types/IPCTypes';
import { IUser } from '../../types';
import { store } from '../../main';
import openpgp from './openpgp';
import * as types from './types';

const crypto = [
  {
    async createKey(event: IpcMainEvent, arg: types.ICreateKey) {
      const { email, name, passphrase, comment } = arg;
      const key = await openpgp.createKey({ email, name, passphrase, comment });
      event.reply('createKeyResponse', key);
    },
  },
  {
    async encrypt(event: IpcMainEvent, arg: types.IEncrypt) {
      const { message, publicKeysArmored } = arg;
      const encrypted = await openpgp.encrypt({ message, publicKeysArmored });
      event.reply('encryptResponse', encrypted);
    },
  },
  {
    async DECRYPT_TEXT(event: IpcMainEvent, arg: types.IDecryptData) {
      const { safetyPhrase } = store.get('user') as IUser;
      console.log(arg.message);
      const encryptedMessage = String(arg.message);
      const decrypted = await openpgp.decrypt({
        encryptedMessage,
        passphrase: safetyPhrase,
      });

      event.reply(IPCTypes.DECRYPT_TEXT_RESPONSE, {
        message: 'ok',
        data: {
          message: decrypted,
        },
      });
    },
  },
  {
    async validateKey(event: IpcMainEvent, arg: types.IValidateKey) {
      const { privateKeyArmored, safetyPhrase } = arg;
      const valid = await openpgp.validateKey({
        privateKeyArmored,
        safetyPhrase,
      });
      event.reply('validateKeyResponse', valid);
    },
  },
  {
    async changePassphrase(event: IpcMainEvent, arg: types.IChangePassphrase) {
      const { email, name, oldPassphrase, newPassphrase, privateKeyArmored } =
        arg;
      const privateKey = await openpgp.changePassphrase({
        email,
        name,
        oldPassphrase,
        newPassphrase,
        privateKeyArmored,
      });
      event.reply('changePassphraseResponse', privateKey);
    },
  },
];

export default crypto;
