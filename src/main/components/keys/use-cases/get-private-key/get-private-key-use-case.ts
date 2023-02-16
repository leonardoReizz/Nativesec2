import openpgp from '@/main/crypto/openpgp';
import { DEFAULT_TYPE } from '@/main/crypto/types';
import { newDatabase, store } from '@/main/main';
import { IInitialData, IKeys, IToken, IUser } from '@/main/types';
import fs from 'fs';
import md5 from 'md5';

import { KeyRepositoryAPI } from '../../repositories/key-repository-api';
import { KeyRepositoryDatabase } from '../../repositories/key-repository-database';

export class GetPrivateKeyUseCase {
  constructor(
    private keyRepositoryDatabase: KeyRepositoryDatabase,
    private keyRepositoryAPI: KeyRepositoryAPI
  ) {}

  async execute() {
    const { email, safetyPhrase, fullName } = store.get('user') as IUser;
    const { accessToken, tokenType } = store.get('token') as IToken;
    const { PATH } = store.get('initialData') as IInitialData;
    const authorization = `${tokenType} ${accessToken}`;
    let checkKey = '';
    let privateKeyId = '';

    if (fs.existsSync(`${PATH}/database/default/${md5(email)}.sqlite3`)) {
      const privKey = await this.keyRepositoryDatabase.getPrivateKey(email);

      if (privKey instanceof Error)
        throw new Error(
          `${
            (store.get('user') as any)?.email
          }: Error DATABASE get private key, ${JSON.stringify(privKey)}`
        );

      if (privKey.length === 0) {
        const apiGetPrivateKey = await this.keyRepositoryAPI.getPrivateKey(
          email,
          authorization
        );
        if (
          apiGetPrivateKey.data?.status === 'ok' &&
          apiGetPrivateKey.data?.msg.length > 0
        ) {
          await this.keyRepositoryDatabase.createPrivateKey({
            _id: apiGetPrivateKey.data.msg[0]._id.$oid,
            email,
            fullName,
            privateKey: apiGetPrivateKey.data.msg[0].chave,
            defaultType: DEFAULT_TYPE,
          });
          checkKey = apiGetPrivateKey.data.msg[0].chave;
          privateKeyId = apiGetPrivateKey.data.msg[0]._id.$oid;
        } else {
          return 'noKey';
        }
      } else {
        checkKey = privKey[0].private_key;
        privateKeyId = privKey[0]._id;
      }
    } else {
      const keys = store.get('keys') as IKeys;
      if (keys.privateKey) {
        checkKey = keys.privateKey;
      } else {
        const apiGetPrivateKey = await this.keyRepositoryAPI.getPrivateKey(
          email,
          authorization
        );
        if (
          apiGetPrivateKey.data?.status === 'ok' &&
          apiGetPrivateKey.data?.msg.length > 0
        ) {
          checkKey = apiGetPrivateKey.data.msg[0].chave;
          privateKeyId = apiGetPrivateKey.data.msg[0]._id.$oid;
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
        privateKeyId,
      });

      await newDatabase.build();
      return 'ok';
    }

    return 'invalidSafetyPhrase';
  }
}
