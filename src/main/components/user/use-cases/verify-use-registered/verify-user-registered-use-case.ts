import { KeyRepositoryAPI } from 'main/components/keys/repositories/key-repository-api';
import { store } from 'main/main';
import { IKeys, IToken, IUser } from 'main/types';

export class VerifyUserRegisteredUseCase {
  constructor(private keyRepositoryAPI: KeyRepositoryAPI) {}

  async execute() {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const { myEmail } = store.get('user') as IUser;
    const authorization = `${tokenType} ${accessToken}`;

    const apiGetPublicKey = await this.keyRepositoryAPI.getPublicKey(
      myEmail,
      authorization
    );

    if (
      apiGetPublicKey.status === 200 &&
      apiGetPublicKey.data?.msg?.length === 0
    ) {
      // create keys

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

      await APIKey.createPublicKey({
        authorization: `${tokenType} ${accessToken}`,
        publicKey: keys.publicKey,
      });
      if (savePrivateKey) {
        await APIKey.createPrivateKey({
          authorization: `${tokenType} ${accessToken}`,
          privateKey: keys.privateKey,
        });
      }
      return 'ok';
    }
  }
}
