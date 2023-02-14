import { KeyRepositoryAPI } from '@/main/components/keys/repositories/key-repository-api';
import { KeyRepositoryDatabase } from '@/main/components/keys/repositories/key-repository-database';
import openpgp from '@/main/crypto/openpgp';
import { newDatabase, store } from '@/main/main';
import { IKeys, IToken, IUser } from '@/main/types';
import { IUserConfig } from '@/renderer/contexts/UserConfigContext/types';
import { IChangeSafetyPhraseRequestDTO } from './change-safety-phrase-request-dto';

export class ChangeSafetyPhraseUseCase {
  constructor(
    private keyRepositoryAPI: KeyRepositoryAPI,
    private keyRepositoryDatabase: KeyRepositoryDatabase
  ) {}

  async execute(data: IChangeSafetyPhraseRequestDTO) {
    const { email, safetyPhrase, fullName } = store.get('user') as IUser;
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const { privateKey, privateKeyId } = store.get('keys') as IKeys;
    const userConfig = store.get('userConfig') as IUserConfig;

    let newPrivateKeyId = '';

    console.log('1');

    /* Generate new private key  */
    const newPrivateKey = await openpgp.changePassphrase({
      email,
      name: fullName,
      newPassphrase: data.newSecret,
      oldPassphrase: safetyPhrase,
      privateKeyArmored: privateKey,
    });

    if (!newPrivateKey) throw new Error('ERROR GENERATE NEW PRIVATE KEY');

    if (Boolean(userConfig.savePrivateKey) === true) {
      /* Delete old private key in API */
      const deleteKey = await this.keyRepositoryAPI.delete(
        { privateKeyId },
        authorization
      );

      if (deleteKey.status !== 200 || deleteKey.data.status !== 'ok') {
        throw new Error(
          `ERROR API SAVE PRIVATE KEY ${JSON.stringify(deleteKey)} `
        );
      }

      /* Save new private key in API */
      const apiUpdateKey = await this.keyRepositoryAPI.createPrivateKey(
        {
          chave: newPrivateKey.privateKey,
          tipo: 'rsa',
        },
        authorization
      );

      if (apiUpdateKey.status !== 200 || apiUpdateKey.data.status !== 'ok') {
        throw new Error(
          `ERROR API SAVE PRIVATE KEY ${JSON.stringify(apiUpdateKey)} `
        );
      }

      newPrivateKeyId = apiUpdateKey.data.detail[0]._id.$oid;
    }

    store.set('keys', {
      ...(store.get('keys') as IKeys),
      privateKey: newPrivateKey.privateKey,
      privateKeyId: newPrivateKeyId,
    });

    /* Delete old private key in database */
    const deleteDBKey =
      await this.keyRepositoryDatabase.deletePrivateKeyByEmail(email);

    /* Save new private key in database */
    const createDBKey = await this.keyRepositoryDatabase.createPrivateKey({
      _id: newPrivateKeyId,
      defaultType: 'rsa',
      email,
      fullName,
      privateKey: newPrivateKey.privateKey,
    });

    /* Change database password */
    const db = newDatabase.changeSafetyPhrase(data.newSecret);

    if (db instanceof Error)
      throw new Error('ERROR CHANGE SAFETY PHRASE IN DATABASE');

    return { message: 'ok' };
  }
}
