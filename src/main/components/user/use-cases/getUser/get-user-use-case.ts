import { store } from '../../../../main';
import { IToken, IUser } from '../../../../types';
import { UserRepositoryAPI } from '../../repositories/user-repository-api';

export class GetUserUseCase {
  constructor(private userRepository: UserRepositoryAPI) {}

  async execute() {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const getUser = await this.userRepository.getUser(authorization);

    if (getUser.status === 200) {
      store.set('user', {
        ...(store.get('user') as IUser),
        myFullName: getUser.data?.full_name,
      });

      return 'ok';
    }

    throw new Error('Error get user api');
  }
}
