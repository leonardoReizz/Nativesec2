import { store } from 'main/main';
import { IKeys, IToken, IUser } from 'main/types';
import { KeyRepositoryAPI } from '../../repositories/key-repository-api';
import { KeyRepositoryDatabase } from '../../repositories/key-repository-database';

export class InsertKeysUseCase {
  constructor(private keyRepositoryDatabase: KeyRepositoryDatabase) {}

  async execute() {
    const { myEmail, myFullName } = store.get('user') as IUser;
    const { privateKey, publicKey } = store.get('keys') as IKeys;
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const dbPrivateKey = await this.keyRepositoryDatabase.getPrivateKey(
      myEmail
    );
    const dbPublicKey = await this.keyRepositoryDatabase.getPublicKey(myEmail);

    if (dbPrivateKey instanceof Error)
      throw new Error('Error get private key in database');
    if (dbPublicKey instanceof Error)
      throw new Error('Error get public key in database');

    if (dbPrivateKey.length === 0 && dbPublicKey.length === 0) {
      const createPrivKey = await DBKeys.createPrivateKey({
        email: myEmail,
        fullName: myFullName,
        privateKey,
      });

      const createPubKey = await DBKeys.createPublicKey({
        email: myEmail,
        fullName: myFullName,
        publicKey,
      });

      if (createPrivKey === true && createPubKey === true) {
        return {
          response: IPCTypes.INSERT_DATABASE_KEYS_RESPONSE,
          data: {
            status: 200,
            data: {
              status: 'ok',
            },
          },
        };
      }
      return {
        response: IPCTypes.INSERT_DATABASE_KEYS_RESPONSE,
        data: {
          status: 400,
        },
      };
    }
  }
}
