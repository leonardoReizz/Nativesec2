import { DEFAULT_TYPE } from '@/main/crypto/types';
import { store } from '@/main/main';
import { IKeys, IUser } from '@/main/types';
import { KeyRepositoryDatabase } from '../../repositories/key-repository-database';

export class InsertKeysUseCase {
  constructor(private keyRepositoryDatabase: KeyRepositoryDatabase) {}

  async execute() {
    const { email, fullName } = store.get('user') as IUser;
    const { privateKey, privateKeyId, publicKeyId, publicKey } = store.get(
      'keys'
    ) as IKeys;

    const dbPrivateKey = await this.keyRepositoryDatabase.getPrivateKey(email);

    const dbPublicKey = await this.keyRepositoryDatabase.getPublicKey(email);

    if (dbPrivateKey instanceof Error)
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error DATABASE get private key, ${JSON.stringify(dbPrivateKey)}`
      );
    if (dbPublicKey instanceof Error)
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error DATABASE get public key, ${JSON.stringify(dbPublicKey)}`
      );

    if (dbPrivateKey.length === 0 && dbPublicKey.length === 0) {
      const createPrivKey = await this.keyRepositoryDatabase.createPrivateKey({
        _id: privateKeyId,
        email: email.toLowerCase(),
        fullName,
        privateKey,
        defaultType: DEFAULT_TYPE,
      });

      const createPubKey = await this.keyRepositoryDatabase.createPublicKey({
        _id: publicKeyId,
        email: email.toLowerCase(),
        fullName,
        publicKey,
        defaultType: DEFAULT_TYPE,
      });

      console.log(createPrivKey, createPubKey);
      if (createPrivKey === true && createPubKey === true) {
        return 'ok';
      }
      return 'nok';
    }
    return 'ok';
  }
}
