import fs from 'fs';
import md5 from 'md5';
import { DEFAULT_TYPE } from '../../../../database/types';
import { IInitialData, IKeys, IToken, IUser } from '../../../../types';
import { newDatabase, store } from '../../../../main';
import { KeyRepositoryAPI } from '../../repositories/key-repository-api';
import { KeyRepositoryDatabase } from '../../repositories/key-repository-database';
import openpgp from '../../../../crypto/openpgp';

export class GetPrivateKeyUseCase {
  constructor(
    private keyRepositoryDatabase: KeyRepositoryDatabase,
    private keyRepositoryAPI: KeyRepositoryAPI
  ) {}

  async execute() {
    const { myEmail, safetyPhrase, myFullName } = store.get('user') as IUser;
    const { accessToken, tokenType } = store.get('token') as IToken;
    const { PATH } = store.get('initialData') as IInitialData;
    const authorization = `${tokenType} ${accessToken}`;
    let checkKey = '';

    if (fs.existsSync(`${PATH}/database/default/${md5(myEmail)}.sqlite3`)) {
      const privKey = await this.keyRepositoryDatabase.getPrivateKey(myEmail);

      if (privKey instanceof Error)
        throw new Error('Error get private key database');

      if (privKey.length === 0) {
        const apiGetPrivateKey = await this.keyRepositoryAPI.getPrivateKey(
          myEmail,
          authorization
        );
        if (
          apiGetPrivateKey.data?.status === 'ok' &&
          apiGetPrivateKey.data?.msg.length > 0
        ) {
          await this.keyRepositoryDatabase.createPrivateKey({
            email: myEmail,
            fullName: myFullName,
            privateKey: apiGetPrivateKey.data.msg[0].chave,
            defaultType: DEFAULT_TYPE,
          });
          checkKey = apiGetPrivateKey.data.msg[0].chave;
        } else {
          return 'noKey';
        }
      } else {
        checkKey = privKey[0].private_key;
      }
    } else {
      const keys = store.get('keys') as IKeys;
      if (keys.privateKey) {
        checkKey = keys.privateKey;
      } else {
        const apiGetPrivateKey = await this.keyRepositoryAPI.getPrivateKey(
          myEmail,
          authorization
        );
        if (
          apiGetPrivateKey.data?.status === 'ok' &&
          apiGetPrivateKey.data?.msg.length > 0
        ) {
          checkKey = apiGetPrivateKey.data.msg[0].chave;
        } else {
          return 'noKey';
        }
      }
    }

    const result = await openpgp.validateKey({
      privateKeyArmored: checkKey,
      safetyPhrase,
    });

    if (result === true) {
      store.set('keys', {
        ...(store.get('keys') as IKeys),
        privateKey: checkKey,
      });

      await newDatabase.build();
      return 'ok';
    }

    return 'invalidSafetyPhrase';
  }
}
