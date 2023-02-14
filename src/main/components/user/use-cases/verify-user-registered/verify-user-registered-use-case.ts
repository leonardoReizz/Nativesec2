import { store } from '@/main/main';
import { KeyRepositoryAPI } from '@/main/components/keys/repositories/key-repository-api';
import { IToken, IUser } from '@/main/types';
import openpgp from '@/main/crypto/openpgp';
import { UserRepositoryAPI } from '../../repositories/user-repository-api';
import { IVerifyUserRegisteredRequestDTO } from './verify-user-registered-request-dto';

export class VerifyUserRegisteredUseCase {
  constructor(
    private keyRepositoryAPI: KeyRepositoryAPI,
    private userRepositoryAPI: UserRepositoryAPI
  ) {}

  async execute(data: IVerifyUserRegisteredRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const { email, safetyPhrase } = store.get('user') as IUser;

    const authorization = `${tokenType} ${accessToken}`;

    const apiGetPublicKey = await this.keyRepositoryAPI.getPublicKey(
      email,
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
        const createPublic = await this.keyRepositoryAPI.createPublicKey(
          { chave: keys.publicKey, tipo: 'rsa' },
          authorization
        );

        if (createPublic.status !== 200 && createPublic.data.status !== 'ok')
          throw new Error(
            ` ERROR API CREATE PUBLIC KEY ${JSON.stringify(createPublic)}`
          );

        let privateKeyId = '';

        if (data?.savePrivateKey) {
          const apiCreatePrivateKey =
            await this.keyRepositoryAPI.createPrivateKey(
              { chave: keys.privateKey, tipo: 'rsa' },
              authorization
            );

          if (
            apiCreatePrivateKey.status !== 200 ||
            apiCreatePrivateKey.data.status !== 'ok'
          )
            throw new Error(
              ` ERROR API CREATE PUBLIC KEY ${JSON.stringify(
                apiCreatePrivateKey
              )}`
            );
          privateKeyId = apiCreatePrivateKey.data.detail[0]._id.$oid;
        }

        store.set('keys', {
          privateKey: keys.privateKey,
          privateKeyId,
          publicKeyId: createPublic.data.detail[0]._id.$oid,
          publicKey: keys.publicKey,
        });

        return 'ok';
      }
      throw new Error('ERROR OPENPGP GENERATE PAR KEYS');
    }
    return 'ok';
  }
}
