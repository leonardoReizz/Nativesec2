import { IToken } from 'main/types';
import { store } from '../../../../main';
import { AuthRepositoryAPI } from '../../repositories/auth-repository-api';

export class RefreshTokenUseCase {
  constructor(private authRepositoryAPI: AuthRepositoryAPI) {}

  async execute() {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const token = await this.authRepositoryAPI.refreshToken(authorization);

    if (token.status === 200) {
      const currentDate = Math.floor(Date.now() / 1000);
      store.set('token', {
        accessToken: token.data.access_token,
        tokenType: token.data.token_type,
        createdAt: currentDate,
      });
      return { message: 'ok' };
    }
    if (token.status === 401) {
      store.set('keys', {});
      store.set('user', {});
      store.set('userConfig', {});
      store.set('safebox', []);
      store.set('organizations', []);
      store.set('organizationInvites', []);
      return { message: 'authorizationError' };
    }

    throw new Error('ERROR REFRESH TOKEN');
  }
}
