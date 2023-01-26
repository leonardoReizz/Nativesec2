import { KeyRepositoryDatabase } from '../../../keys/repositories/key-repository-database';
import openpgp from '../../../../crypto/openpgp';
import { KeyRepositoryAPI } from '../../../keys/repositories/key-repository-api';
import { store } from '../../../../main';
import { IToken, IUser } from '../../../../types';
import { IVerifyUserRegisteredRequestDTO } from './verify-user-registered-request-dto';
import { UserRepositoryAPI } from '../../repositories/user-repository-api';

export class VerifyUserRegisteredUseCase {
  constructor(
    private keyRepositoryAPI: KeyRepositoryAPI,
    private keyRepositoryDatabase: KeyRepositoryDatabase,
    private userRepositoryAPI: UserRepositoryAPI
  ) {}

  async execute(data: IVerifyUserRegisteredRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const { myEmail, safetyPhrase } = store.get('user') as IUser;

    const authorization = `${tokenType} ${accessToken}`;

    const apiGetPublicKey = await this.keyRepositoryAPI.getPublicKey(
      myEmail,
      authorization
    );

    if (
      apiGetPublicKey.status === 200 &&
      apiGetPublicKey.data?.msg?.length === 0
    ) {
      const getUser = await this.userRepositoryAPI.getUser(authorization);

      const keys = await openpgp.generateParKeys({
        myEmail: getUser.data.email,
        myFullName: getUser.data.full_name,
        safetyPhrase,
      });

      if (keys) {
        store.set('keys', {
          privateKey: keys.privateKey,
          publicKey: keys.publicKey,
        });

        const createPublic = await this.keyRepositoryAPI.createPublicKey(
          { publicKey: keys.publicKey, type: 'rsa' },
          authorization
        );

        if (createPublic.status !== 200 || createPublic.data.status !== 'ok') {
          throw new Error(
            `Erro create public key api: ${JSON.stringify(createPublic)}`
          );
        }

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
