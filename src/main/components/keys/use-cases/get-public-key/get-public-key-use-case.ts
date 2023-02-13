import { store } from '@/main/main';
import { IInitialData, IKeys, IToken, IUser } from '@/main/types';
import fs from 'fs';
import md5 from 'md5';

import { KeyRepositoryAPI } from '../../repositories/key-repository-api';
import { KeyRepositoryDatabase } from '../../repositories/key-repository-database';

export class GetPublicKeyUseCase {
  constructor(
    private keyRepositoryDatabase: KeyRepositoryDatabase,
    private keyRepositoryAPI: KeyRepositoryAPI
  ) {}

  async execute() {
    const { myEmail } = store.get('user') as IUser;
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const { PATH } = store.get('initialData') as IInitialData;

    if (fs.existsSync(`${PATH}/database/default/${md5(myEmail)}.sqlite3`)) {
      const getPublicKeyInDatabase =
        await this.keyRepositoryDatabase.getPublicKey(myEmail);

      if (getPublicKeyInDatabase instanceof Error)
        throw new Error('Error get public key in database');

      if (!getPublicKeyInDatabase[0]) {
        const apiGetPublicKey = await this.keyRepositoryAPI.getPublicKey(
          myEmail,
          authorization
        );
        console.log(apiGetPublicKey);
        if (
          apiGetPublicKey.status === 200 &&
          apiGetPublicKey.data?.msg.length > 0
        ) {
          store.set('keys', {
            ...(store.get('keys') as IKeys),
            publicKey: apiGetPublicKey.data?.msg[0].chave,
          });
          return 'ok';
        }
        throw new Error('API error get public key');
      }
      store.set('keys', {
        ...(store.get('keys') as IKeys),
        publicKey: getPublicKeyInDatabase[0].public_key,
      });
      return 'ok';
    }

    const apiGetPublicKey = await this.keyRepositoryAPI.getPublicKey(
      myEmail,
      authorization
    );

    if (
      apiGetPublicKey.status === 200 &&
      apiGetPublicKey.data?.msg.length > 0
    ) {
      store.set('keys', {
        ...(store.get('keys') as IKeys),
        publicKey: apiGetPublicKey.data?.msg[0].chave,
      });
      return 'ok';
    }
    throw new Error('API error get public key');
  }
}
