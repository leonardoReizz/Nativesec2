import openpgp from '@/main/crypto/openpgp';
import { DEFAULT_TYPE } from '@/main/crypto/types';
import { store } from '@/main/main';
import { IToken, IUser } from '@/main/types';
import { KeyRepositoryAPI } from '../../repositories/key-repository-api';
import { KeyRepositoryDatabase } from '../../repositories/key-repository-database';
import { IGenerateParKeysRequestDTO } from './generate-par-key-request-dto';

export class GenerateParKeysUseCase {
  constructor(
    private keyRepositoryDatabase: KeyRepositoryDatabase,
    private keyRepositoryAPI: KeyRepositoryAPI
  ) {}

  async execute(data: IGenerateParKeysRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const { savePrivateKey } = data;
    const user = store.get('user') as IUser;

    const keys = await openpgp.generateParKeys({
      myEmail: user.email,
      myFullName: user.fullName,
      safetyPhrase: user.safetyPhrase,
    });

    const privateKey = await this.keyRepositoryDatabase.getPrivateKey(
      user.email
    );
    const publicKey = await this.keyRepositoryDatabase.getPublicKey(user.email);

    if (privateKey instanceof Error)
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error DATABASE get private key, ${JSON.stringify(privateKey)}`
      );
    if (publicKey instanceof Error)
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error DATABASE get public Key, ${JSON.stringify(publicKey)}`
      );

    if (privateKey.length === 0 && publicKey.length === 0) {
      if (keys?.privateKey && keys?.publicKey) {
        const apiCreatePublicKey = await this.keyRepositoryAPI.createPublicKey(
          {
            chave: keys.publicKey,
            tipo: 'rsa',
          },
          authorization
        );

        if (
          apiCreatePublicKey.status !== 200 ||
          apiCreatePublicKey.data.status !== 'ok'
        ) {
          throw new Error(
            `${
              (store.get('user') as any)?.email
            }: Error API create public key safebox, ${JSON.stringify(
              apiCreatePublicKey
            )}`
          );
        }

        const p2 = await this.keyRepositoryDatabase.createPublicKey({
          _id: apiCreatePublicKey.data.detail[0]._id.$oid,
          email: user.email,
          fullName: user.fullName,
          publicKey: keys.publicKey,
          defaultType: DEFAULT_TYPE,
        });
        let privateKeyId = '';
        if (savePrivateKey) {
          const apiCreatePrivateKey =
            await this.keyRepositoryAPI.createPrivateKey(
              {
                chave: keys.privateKey,
                tipo: 'rsa',
              },
              authorization
            );

          if (
            apiCreatePrivateKey.status !== 200 ||
            apiCreatePrivateKey.data.status !== 'ok'
          ) {
            throw new Error(
              `${
                (store.get('user') as any)?.email
              }: Error API create private key, ${JSON.stringify(
                apiCreatePrivateKey
              )}`
            );
          }
          privateKeyId = apiCreatePrivateKey.data.detail[0]._id.$oid;
        }

        const p1 = await this.keyRepositoryDatabase.createPrivateKey({
          _id: privateKeyId,
          email: user.email,
          fullName: user.fullName,
          privateKey: keys.privateKey,
          defaultType: DEFAULT_TYPE,
        });

        store.set('keys', {
          privateKey: keys.privateKey,
          publicKey: keys.publicKey,
        });

        return {
          message: 'ok',
          data: {
            data: {
              createPrivate: p1,
              createPublic: p2,
            },
          },
        };
      }
    }
    return { message: 'nok' };
  }
}
