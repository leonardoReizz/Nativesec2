import { IKeys, IUser } from '../../../../types';
import { DEFAULT_TYPE } from '../../../../database/types';
import { store } from '../../../../main';
import { KeyRepositoryDatabase } from '../../repositories/key-repository-database';

export class InsertKeysUseCase {
  constructor(private keyRepositoryDatabase: KeyRepositoryDatabase) {}

  async execute() {
    const { myEmail, myFullName } = store.get('user') as IUser;
    const { privateKey, publicKey } = store.get('keys') as IKeys;

    const dbPrivateKey = await this.keyRepositoryDatabase.getPrivateKey(
      myEmail
    );
    const dbPublicKey = await this.keyRepositoryDatabase.getPublicKey(myEmail);

    if (dbPrivateKey instanceof Error)
      throw new Error('Error get private key in database');
    if (dbPublicKey instanceof Error)
      throw new Error('Error get public key in database');

    if (dbPrivateKey.length === 0 && dbPublicKey.length === 0) {
      const createPrivKey = await this.keyRepositoryDatabase.createPrivateKey({
        email: myEmail.toLowerCase(),
        fullName: myFullName,
        privateKey,
        defaultType: DEFAULT_TYPE,
      });

      const createPubKey = await this.keyRepositoryDatabase.createPublicKey({
        email: myEmail.toLowerCase(),
        fullName: myFullName,
        publicKey,
        defaultType: DEFAULT_TYPE,
      });

      if (createPrivKey === true && createPubKey === true) {
        return 'ok';
      }
      return 'nok';
    }
    return 'ok';
  }
}
