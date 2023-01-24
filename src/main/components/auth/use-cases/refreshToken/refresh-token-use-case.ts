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
      store.set('token', {
        accessToken: token.data.access_token,
        tokenType: token.data.token_type,
      });
      return 'ok';
    }
    return 'nok';
  }
}
