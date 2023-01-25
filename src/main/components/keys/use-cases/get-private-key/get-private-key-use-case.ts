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
      console.log('tenho banco', myEmail);
      const privKey = await this.keyRepositoryDatabase.getPrivateKey(myEmail);

      console.log(privKey instanceof Error);
      if (privKey instanceof Error)
        throw new Error('Error get private key database');

      console.log(privKey, 'database');
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

    console.log('aqui');

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

    // console.log('teste');

    // const apiGetPrivateKey = await this.keyRepositoryAPI.getPrivateKey(
    //   if (fs.existsSync(`${PATH}/database/default/${md5(myEmail)}.sqlite3`)) {myEmail,
    //   authorization
    // );

    // if (apiGetPrivateKey.data?.status === 'ok') {
    //   if (apiGetPrivateKey.data?.msg.length > 0) {
    //     store.set('keys', {
    //       ...(store.get('keys') as IKeys),
    //       privateKey: apiGetPrivateKey.data.msg[0].chave,
    //     });

    //     const result = await openpgp.validateKey({
    //       privateKeyArmored: apiGetPrivateKey.data.msg[0].chave,
    //       safetyPhrase,
    //     });

    //     if (result === true) {
    //       store.set('keys', {
    //         ...(store.get('keys') as IKeys),
    //         privateKey: undefined,
    //       });
    //       return 'ok';
    //     }
    //     return 'invalidSafetyPhrase';
    //   }
    // }

    // return 'noKey';
  }
}
