import { store } from '@/main/main';
import { UserRepositoryDatabase } from '@/main/components/user/repositories/user-repository-database';
import { IPCError } from '@/main/utils/IPCError';
import { KeyRepositoryAPI } from '@/main/components/keys/repositories/key-repository-api';
import { UserRepositoryAPI } from '../../repositories/user-repository-api';

export class GetUserUseCase {
  constructor(
    private userRepositoryAPI: UserRepositoryAPI,
    private userRepositoryDatabase: UserRepositoryDatabase,
    private keyRepositoryAPI: KeyRepositoryAPI
  ) {}

  async execute() {
    const user = store.get('user') as IUser;
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const getUserDatabase =
      await this.userRepositoryDatabase.getUserConfigByEmail(user?.email);

    IPCError({
      object: getUserDatabase,
      type: 'database',
      message: 'ERROR DATABASE GET USER CONFIG BY EMAIL',
    });

    const getUserApi = await this.userRepositoryAPI.getUser(authorization);

    IPCError({
      object: getUserApi,
      type: 'database',
      message: 'ERROR API GET USER',
    });

    if (getUserDatabase) {
      // user config exist
      store.set('user', {
        ...(store.get('user') as IUser),
        fullName: getUserApi.full_name,
        savePrivateKey: getUserDatabase.savePrivateKey,
        refreshTime: getUserDatabase.refreshTime,
        theme: getUserDatabase.theme,
        lastOrganizationId: getUserDatabase.lastOrganizationId,
        email: getUserDatabase.email,
      });
    } else {
      // user config not exist
      const apiGetPrivateKey = await this.keyRepositoryAPI.getPrivateKey(
        user.email,
        authorization
      );

      IPCError({
        object: apiGetPrivateKey,
        message: 'ERROR API GET PRIVATE KEY',
        type: 'api',
      });

      const savePrivateKey = apiGetPrivateKey.data?.msg.length > 0;

      if (apiGetPrivateKey.data?.msg.length > 0) {
        store.set('user', {
          ...(store.get('user') as IUser),
          fullName: getUserApi.full_name,
          savePrivateKey,
          refreshTime: 30,
          theme: 'light',
          lastOrganizationId: '',
          email: user.email,
        });

        const createUserConfigDatabase =
          await this.userRepositoryDatabase.createUserConfig({
            savePrivateKey: String(savePrivateKey),
            refreshTime: 30,
            theme: 'light',
            lastOrganizationId: '',
            email: user.email,
          });

        IPCError({
          object: createUserConfigDatabase,
          message: 'ERROR DATABASE CREATE USER CONFIG',
          type: 'database',
        });
      }
    }
    return { message: 'ok' };
  }
}
