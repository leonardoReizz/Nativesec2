import { KeyRepositoryAPI } from '@/main/components/keys/repositories/key-repository-api';
import { KeyRepositoryDatabase } from '@/main/components/keys/repositories/key-repository-database';
import openpgp from 'openpgp';
import { store } from '@/main/main';
import { IKeys, IToken, IUser } from '@/main/types';
import { IUserConfig } from '@/renderer/contexts/UserConfigContext/types';
import { UserRepositoryDatabase } from '../../repositories/user-repository-database';
import { IChangeSafetyPhraseRequestDTO } from './change-safety-phrase-request-dto';

export class ChangeSafetyPhraseUseCase {
  constructor(
    private userRepositoryDatabase: UserRepositoryDatabase,
    private keyRepositoryAPI: KeyRepositoryAPI,
    private keyRepositoryDatabase: KeyRepositoryDatabase
  ) {}

  async execute(data: IChangeSafetyPhraseRequestDTO) {
    const { myEmail, safetyPhrase, myFullName } = store.get('user') as IUser;
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const { privateKey } = store.get('keys') as IKeys;
    const userConfig = store.get('userConfig') as IUserConfig;

    const privateKeyDecrypt = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
      passphrase: safetyPhrase,
    });

    const newKey = await openpgp.reformatKey({
      privateKey: privateKeyDecrypt,
      userIDs: [{ email: myEmail.toLowerCase(), name: myFullName }],
      passphrase: data.newSecret,
    });

    if (Boolean(userConfig.savePrivateKey) === true) {
      const deleteKey = await this.keyRepositoryAPI.delete();
      const updateKey = await this.keyRepositoryAPI.createPrivateKey(
        {
          chave: newKey.privateKey,
          tipo: 'rsa',
        },
        authorization
      );
    }

    store.set('keys', {
      ...(store.get('keys') as IKeys),
      privateKey: newKey.privateKey,
    });

    const deleteDBKey = this.keyRepositoryDatabase.deletePrivateKey();
    const createDBKey = this.keyRepositoryDatabase.createPrivateKey();

    // db.all(
    //   `UPDATE private_keys SET private_key ='${newKey.privateKey}' WHERE email = '${myEmail}'`
    // );

    return { message: 'ok' };
  }
}
