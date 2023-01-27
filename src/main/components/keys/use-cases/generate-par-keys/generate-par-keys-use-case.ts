import openpgp from 'main/crypto/openpgp';
import { DEFAULT_TYPE } from 'main/database/types';
import { store } from 'main/main';
import { IToken, IUser } from 'main/types';
import { KeyRepositoryAPI } from '../../repositories/key-repository-api';
import { KeyRepositoryDatabase } from '../../repositories/key-repository-database';

export class GenerateParKeysUseCase {
  constructor(
    private keyRepositoryDatabase: KeyRepositoryDatabase,
    private keyRepositoryAPI: KeyRepositoryAPI
  ) {}

  async execute(data: IGenerateParKeysRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const { savePrivateKey } = data.savePrivateKey;
    const user = store.get('user') as IUser;

    store.set('userConfig', { savePrivateKey });
    const keys = await openpgp.generateParKeys(user);

    const privateKey = await this.keyRepositoryDatabase.getPrivateKey(
      user.myEmail
    );
    const publicKey = await this.keyRepositoryDatabase.getPublicKey(
      user.myEmail
    );

    if (privateKey instanceof Error || publicKey instanceof Error)
      throw new Error('Erro get keys in database');
    if (privateKey.length === 0 && publicKey.length === 0) {
      if (keys?.privateKey && keys?.publicKey) {
        const p1 = await this.keyRepositoryDatabase.createPrivateKey({
          email: user.myEmail,
          fullName: user.myFullName,
          privateKey: keys.privateKey,
          defaultType: DEFAULT_TYPE,
        });
        const p2 = await this.keyRepositoryDatabase.createPublicKey({
          email: user.myEmail,
          fullName: user.myFullName,
          publicKey: keys.publicKey,
          defaultType: DEFAULT_TYPE,
        });
        store.set('keys', {
          privateKey: keys.privateKey,
          publicKey: keys.publicKey,
        });

        await this.keyRepositoryAPI.createPublicKey({
          authorization: `${tokenType} ${accessToken}`,
          publicKey: keys.publicKey,
        });
        if (savePrivateKey) {
          await this.keyRepositoryAPI.createPrivateKey({
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
}
