/* eslint-disable promise/always-return */
import axios from 'axios';
import fs from 'fs';
import md5 from 'md5';
import { IPCTypes } from '../../../renderer/@types/IPCTypes';
import * as types from '../../types';
import openpgp from '../../crypto/openpgp';
import { store } from '../../main';
import database from '../../database/database';
import DB from '../../database/index';
import { api } from '../../util';
import { IUserConfig } from '../user/types';
import { UseIPCData } from '..';
import APIKey from '../../API/keys/index';
import DBKeys from '../../database/keys';
import DBUser from '../../database/user';

export async function getPrivateKey(arg: UseIPCData) {
  const { myEmail, safetyPhrase, myFullName } = store.get(
    'user'
  ) as types.IUser;
  const { accessToken, tokenType } = store.get('token') as types.IToken;
  const { PATH } = store.get('initialData') as types.IInitialData;

  if (fs.existsSync(`${PATH}/database/default/${md5(myEmail)}.sqlite3`)) {
    const db = await database.CreateDatabase({ myEmail, PATH });
    await DB.Init({ db, secret: safetyPhrase });
    const privKey = await DBKeys.getPrivateKey({
      email: myEmail,
    });

    if (privKey.length === 0) {
      const apiGetPrivateKey = await APIKey.getPrivateKey({
        email: myEmail,
        authorization: `${tokenType} ${accessToken}`,
      });
      if (apiGetPrivateKey.data?.status === 'ok') {
        if (apiGetPrivateKey.data?.msg.length > 0) {
          const save = await DBKeys.createPrivateKey({
            email: myEmail,
            fullName: myFullName,
            privateKey: apiGetPrivateKey.data.msg[0].chave,
          });
          store.set('keys', {
            ...(store.get('keys') as types.IKeys),
            privateKey: apiGetPrivateKey.data.msg[0].chave,
          });
          if (save) {
            return {
              response: IPCTypes.GET_PRIVATE_KEY_RESPONSE,
              data: {
                status: 200,
                data: {
                  status: 'ok',
                  databaseExists: arg.data?.databaseExists,
                },
              },
            };
          }
        }
      }
    } else {
      store.set('keys', {
        ...(store.get('keys') as types.IKeys),
        privateKey: privKey[0].private_key,
      });
      return {
        response: IPCTypes.GET_PRIVATE_KEY_RESPONSE,
        data: {
          status: 200,
          data: {
            status: 'ok',
            databaseExists: arg.data?.databaseExists,
          },
        },
      };
    }
  } else {
    const apiGetPrivateKey = await APIKey.getPrivateKey({
      email: myEmail,
      authorization: `${tokenType} ${accessToken}`,
    });
    if (apiGetPrivateKey.data?.status === 'ok') {
      if (apiGetPrivateKey.data?.msg.length > 0) {
        store.set('keys', {
          ...(store.get('keys') as types.IKeys),
          privateKey: apiGetPrivateKey.data.msg[0].chave,
        });
        return {
          response: IPCTypes.GET_PRIVATE_KEY_RESPONSE,
          data: {
            status: 200,
            data: {
              status: 'ok',
              databaseExists: arg.data?.databaseExists,
            },
          },
        };
      }
    }
  }
  return {
    response: IPCTypes.GET_PRIVATE_KEY_RESPONSE,
    data: {
      status: 404,
    },
  };
}
export async function generateParKeys(arg: UseIPCData) {
  const { accessToken, tokenType } = store.get('token') as types.IToken;
  const { savePrivateKey } = arg.data;
  const user = store.get('user') as types.IUser;

  store.set('userConfig', { savePrivateKey });
  const keys = await openpgp.generateParKeys(user);

  const privateKey = await DBKeys.getPrivateKey({ email: user.myEmail });
  const publicKey = await DBKeys.getPublicKey({ email: user.myEmail });

  if (privateKey.length === 0 && publicKey.length === 0) {
    if (keys?.privateKey && keys?.publicKey) {
      const p1 = await DBKeys.createPrivateKey({
        email: user.myEmail,
        fullName: user.myFullName,
        privateKey: keys.privateKey,
      });
      const p2 = await DBKeys.createPublicKey({
        email: user.myEmail,
        fullName: user.myFullName,
        publicKey: keys.publicKey,
      });
      store.set('keys', {
        privateKey: keys.privateKey,
        publicKey: keys.publicKey,
      });

      await APIKey.createPublicKey({
        authorization: `${tokenType} ${accessToken}`,
        publicKey: keys.publicKey,
      });
      if (savePrivateKey) {
        await APIKey.createPrivateKey({
          authorization: `${tokenType} ${accessToken}`,
          privateKey: keys.privateKey,
        });
      }
      return {
        response: IPCTypes.GENERATE_PAR_KEYS_RESPONSE,
        data: {
          data: {
            createPrivate: p1,
            createPublic: p2,
          },
        },
      };
    }
  }
  return {
    response: IPCTypes.GENERATE_PAR_KEYS_RESPONSE,
  };
}
const keyLocal = [
  {
    async saveAPIPrivateKey(event: Electron.IpcMainEvent, arg: any) {
      const { accessToken, tokenType } = store.get('token') as types.IToken;
      const { privateKey } = store.get('keys') as types.IKeys;
      const { myEmail, safetyPhrase } = store.get('user') as types.IUser;
      const { PATH } = store.get('initialData') as types.IInitialData;
      const db = await database.CreateDatabase({ myEmail, PATH });
      await DB.Init({ db, secret: safetyPhrase });
      axios
        .post(
          `${api}/privatekey/`,
          {
            chave: privateKey,
            tipo: 'rsa',
          },
          {
            headers: {
              Authorization: `${tokenType} ${accessToken}`,
            },
          }
        )
        .then(async (result) => {
          store.set('userConfig', {
            ...(store.get('userConfig') as IUserConfig),
            savePrivateKey: true,
          });
          const userConfig = store.get('userConfig') as IUserConfig;
          await DBUser.updateUserConfig({ userConfig, myEmail });
          event.reply('saveAPIPrivateKey-response', {
            status: result.status,
            data: result.data,
          });
        })
        .catch((err) => {
          event.reply('saveAPIPrivateKey-response', {
            status: err.response.status,
            data: err.response.data,
          });
        });
    },
  },
  {
    async deleteAPIPrivateKey(event: Electron.IpcMainEvent, arg: any) {
      const { accessToken, tokenType } = store.get('token') as types.IToken;
      const { privateKey } = store.get('keys') as types.IKeys;
      const { myEmail, safetyPhrase } = store.get('user') as types.IUser;
      const { PATH } = store.get('initialData') as types.IInitialData;
      const db = await database.CreateDatabase({ myEmail, PATH });
      await DB.Init({ db, secret: safetyPhrase });
      axios
        .delete(`${api}/privatekey/`, {
          data: {
            chave: privateKey,
            tipo: 'rsa',
          },
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        })
        .then(async (result) => {
          store.set('userConfig', {
            ...(store.get('userConfig') as IUserConfig),
            savePrivateKey: false,
          });
          const userConfig = store.get('userConfig') as IUserConfig;
          await DBUser.updateUserConfig({ userConfig, myEmail });
          event.reply('deleteAPIPrivateKey-response', {
            status: result.status,
            data: result.data,
          });
        })
        .catch((err) => {
          event.reply('deleteAPIPrivateKey-response', {
            status: err.response.status,
            data: err.response.data,
          });
        });
    },
  },
];

export { keyLocal };
