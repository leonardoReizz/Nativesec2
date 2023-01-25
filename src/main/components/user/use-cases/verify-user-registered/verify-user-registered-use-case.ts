import { DEFAULT_TYPE } from '../../../../database/types';
import { KeyRepositoryDatabase } from '../../../keys/repositories/key-repository-database';
import openpgp from '../../../../crypto/openpgp';
import { KeyRepositoryAPI } from '../../../keys/repositories/key-repository-api';
import { store } from '../../../../main';
import { IToken, IUser } from '../../../../types';
import { IVerifyUserRegisteredRequestDTO } from './verify-user-registered-request-dto';

export class VerifyUserRegisteredUseCase {
  constructor(
    private keyRepositoryAPI: KeyRepositoryAPI,
    private keyRepositoryDatabase: KeyRepositoryDatabase
  ) {}

  async execute(data: IVerifyUserRegisteredRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const { myEmail } = store.get('user') as IUser;
    const user = store.get('user') as IUser;

    const authorization = `${tokenType} ${accessToken}`;

    const apiGetPublicKey = await this.keyRepositoryAPI.getPublicKey(
      myEmail,
      authorization
    );

    if (
      apiGetPublicKey.status === 200 &&
      apiGetPublicKey.data?.msg?.length === 0
    ) {
      store.set('userConfig', {
        savePrivateKey: data.savePrivateKey ? data.savePrivateKey : false,
      });
      const keys = await openpgp.generateParKeys(user);

      if (keys) {
        await this.keyRepositoryDatabase.createPrivateKey({
          email: user.myEmail,
          fullName: user.myFullName,
          privateKey: keys.privateKey,
          defaultType: DEFAULT_TYPE,
        });

        await this.keyRepositoryDatabase.createPublicKey({
          email: user.myEmail,
          fullName: user.myFullName,
          publicKey: keys.publicKey,
          defaultType: DEFAULT_TYPE,
        });

        store.set('keys', {
          privateKey: keys.privateKey,
          publicKey: keys.publicKey,
        });

        await this.keyRepositoryAPI.createPublicKey(
          { publicKey: keys.publicKey, type: 'rsa' },
          authorization
        );

        if (data?.savePrivateKey) {
          await this.keyRepositoryAPI.createPrivateKey(
            { privateKey: keys.privateKey, type: 'rsa' },
            authorization
          );
        }

        return 'ok';
      }

      return 'nok';
    }

    return 'ok';
  }
}
