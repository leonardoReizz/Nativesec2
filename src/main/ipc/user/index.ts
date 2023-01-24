/* eslint-disable promise/always-return */
import axios from 'axios';
import { IPCTypes } from '../../../renderer/@types/IPCTypes';
import { newDatabase, store } from '../../main';
import { IInitialData, IToken, IUser, UseIPCData } from '../../types';
import { api } from '../../util';
import { ICreateUser } from './types';
import DB from '../../database';
import database from '../../database/database';
import APIUser from '../../API/user';
import DBUser from '../../database/user';

export async function authPassword(arg: UseIPCData) {
  let response = IPCTypes.AUTH_PASSWORD_RESPONSE;
  if (arg.data.type === 'register') {
    response = IPCTypes.AUTH_PASSWORD_RESPONSE_REGISTER;
  }

  const result = await APIUser.authPassword({ email: arg.data.email });
  if (result.status === 200 && result.data?.status === 'ok') {
    if (arg.data.type !== 'register') {
      store.set('user', {
        ...(store.get('user') as IUser),
        myEmail: arg.data.email,
      });
    }
  }
  return {
    response,
    data: {
      status: result.status,
      data: result.data,
    },
  };
}

export async function verifyDatabasePassword() {
  const buildDatabase = await newDatabase.build();

  if (buildDatabase instanceof Error) {
    if (buildDatabase.message === 'SQLITE_NOTADB: file is not a database') {
      return {
        response: IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
        data: {
          type: 'invalidPassword',
          message: 'nok',
        },
      };
    }
    return {
      response: IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
      data: {
        message: 'nok',
      },
    };
  }

  return {
    response: IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
    data: {
      message: 'ok',
    },
  };
}

export async function updateUserConfig(arg: UseIPCData) {
  const { myEmail } = store.get('user') as IUser;
  const data = await DBUser.updateUserConfig({ userConfig: arg.data, myEmail });
  store.set('userConfig', arg.data);

  return {
    response: IPCTypes.UPDATE_USER_CONFIG_RESPONSE,
    data,
  };
}

const user = [
  {
    async createUser(event: Electron.IpcMainEvent, arg: ICreateUser[]) {
      const { myEmail, myFullName, safetyPhrase } = arg[0];
      axios
        .post(`${api}/user`, {
          full_name: myFullName,
          email: myEmail.toLowerCase(),
        })
        .then((result) => {
          store.set('register', { register: true });
          store.set('user', { myEmail, myFullName, safetyPhrase });
          event.reply('createUser-response', {
            status: result.status,
            data: result.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  {
    async refreshToken(_event: Electron.IpcMainEvent, _arg: unknown) {
      const { tokenType, accessToken } = store.get('token') as IToken;
      axios
        .get(`${api}/auth/token`, {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        })
        .then((result) => {
          store.set('token', {
            accessToken: result.data.access_token,
            tokenType: result.data.token_type,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  {
    async changeSafetyPhrase(event: Electron.IpcMainEvent, arg: any) {
      const { myEmail, safetyPhrase } = store.get('user') as IUser;
      const newSafetyPhrase = arg[0].newSecret;
      const { PATH } = store.get('initialData') as IInitialData;
      const db = await database.CreateDatabase({ myEmail, PATH });
      await DB.Init({ db, secret: safetyPhrase });

      if (newSafetyPhrase !== undefined) {
        try {
          const success = await database.ChangeSafetyPhrase({
            newSafetyPhrase,
            db,
          });

          if (success) {
            db.run(`PRAGMA rekey = '${newSafetyPhrase}'`);
            store.set('user', {
              ...(store.get('user') as IUser),
              safetyPhrase: newSafetyPhrase,
            });
            event.reply('changeSafetyPhrase-response', {
              status: 200,
              data: {
                status: 'ok',
              },
            });
          } else {
            console.log('Error ChangeSafetyPhrase');
            event.reply('changeSafetyPhrase-response', {
              status: 400,
              data: {
                status: 'ok',
              },
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
  },
];

export default user;
