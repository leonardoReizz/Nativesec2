import { IUser } from '../../../../types';
import { store } from '../../../../main';
import { AuthRepositoryAPI } from '../../repositories/auth-repository-api';
import { ILoginRequestDTO } from './login-request-dto';

export class LoginUseCase {
  constructor(private authRepository: AuthRepositoryAPI) {}

  async execute(data: ILoginRequestDTO) {
    const { myEmail } = store.get('user') as IUser;

    const result = await this.authRepository.login({ ...data, email: myEmail });

    if (result.status === 200) {
      store.set('token', {
        accessToken: result.data.access_token,
        tokenType: result.data.token_type,
      });
      return 'ok';
    }

    return 'nok';
  }
}
