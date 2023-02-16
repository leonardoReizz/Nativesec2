import { KeyRepositoryAPI } from '@/main/components/keys/repositories/key-repository-api';
import { UserConfigRepositoryDatabase } from '@/main/components/user-config/repositories/user-config-repository-database';
import { store } from '@/main/main';
import { IToken, IUser } from '@/main/types';

export class SetUserConfigUseCase {
  constructor(
    private userConfigRepositoryDatabase: UserConfigRepositoryDatabase,
    private keyRepositoryApi: KeyRepositoryAPI
  ) {}

  async execute() {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const { email } = store.get('user') as IUser;
    const userConfig = await this.userConfigRepositoryDatabase.getUserConfig(
      email
    );

    if (userConfig instanceof Error)
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error DATABASE get user config, ${JSON.stringify(userConfig)}`
      );

    if (userConfig.length === 0) {
      const apiGetPrivateKey = await this.keyRepositoryApi.getPrivateKey(
        email,
        authorization
      );

      if (apiGetPrivateKey.data.status !== 'ok') {
        throw new Error(
          `${
            (store.get('user') as any)?.email
          }: Error API get private key, ${JSON.stringify(apiGetPrivateKey)}`
        );
      }

      if (apiGetPrivateKey.data.msg.length > 0) {
        store.set('userConfig', {
          savePrivateKey: 'true',
          refreshTime: 30,
          lastOrganizationId: '',
          theme: 'light',
        });

        this.userConfigRepositoryDatabase.create({
          email,
          savePrivateKey: 'true',
          refreshTime: 30,
          lastOrganizationId: '',
          theme: 'light',
        });

        return 'ok';
      }
      store.set('userConfig', {
        refreshTime: 30,
        theme: 'light',
        savePrivateKey: 'false',
        lastOrganizationId: '',
      });
      this.userConfigRepositoryDatabase.create({
        email,
        savePrivateKey: 'false',
        refreshTime: 30,
        lastOrganizationId: '',
        theme: 'light',
      });

      return 'ok';
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
