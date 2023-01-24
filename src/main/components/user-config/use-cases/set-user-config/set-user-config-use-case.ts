import { KeyRepositoryAPI } from '../../../keys/repositories/key-repository-api';
import { store } from '../../../../main';
import { IToken, IUser } from '../../../../types';
import { UserConfigRepositoryDatabase } from '../../repositories/user-config-repository-database';

export class SetUserConfigUseCase {
  constructor(
    private userConfigRepositoryDatabase: UserConfigRepositoryDatabase,
    private keyRepositoryApi: KeyRepositoryAPI
  ) {}

  async execute() {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const { myEmail } = store.get('user') as IUser;
    const userConfig = await this.userConfigRepositoryDatabase.getUserConfig(
      myEmail
    );

    console.log(userConfig);
    if (userConfig instanceof Error)
      throw new Error('Error get user config api');

    if (userConfig.length === 0) {
      const apiGetPrivateKey = await this.keyRepositoryApi.getPrivateKey(
        myEmail,
        authorization
      );
      if (apiGetPrivateKey.data.status === 'ok') {
        if (apiGetPrivateKey.data.msg.length > 0) {
          store.set('userConfig', {
            savePrivateKey: true,
            refreshTime: '30',
            lastOrganizationId: '',
            theme: 'light',
          });

          this.userConfigRepositoryDatabase.create({
            email: myEmail,
            savePrivateKey: 'true',
            refreshTime: 30,
            lastOrganizationId: '',
            theme: 'light',
          });

          return 'ok';
        }
        store.set('userConfig', {
          refreshTime: '30',
          theme: 'light',
          savePrivateKey: false,
          lastOrganizationId: '',
        });
        this.userConfigRepositoryDatabase.create({
          email: myEmail,
          savePrivateKey: 'false',
          refreshTime: 30,
          lastOrganizationId: '',
          theme: 'light',
        });

        return 'ok';
      }
      throw new Error('Api error get private key');
    }
    store.set('userConfig', {
      refreshTime: userConfig[0].refreshTime,
      theme: userConfig[0].theme,
      savePrivateKey: userConfig[0].savePrivateKey,
      lastOrganizationId: userConfig[0].lastOrganizationId,
    });

    return 'ok';
  }
}
