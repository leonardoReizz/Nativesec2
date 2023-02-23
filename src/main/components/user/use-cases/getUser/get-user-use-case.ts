import { store } from '@/main/main';
import { IToken, IUser } from '@/main/types';
import { UserRepositoryAPI } from '../../repositories/user-repository-api';

export class GetUserUseCase {
  constructor(private userRepository: UserRepositoryAPI) {}

  async execute() {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const getUser = await this.userRepository.getUser(authorization);

    if (getUser.status !== 200) {
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error API get user, ${JSON.stringify(getUser)}`
      );
    }

    store.set('user', {
      ...(store.get('user') as IUser),
      fullName: getUser.data.full_name,
      savePrivateKey: getUser.data.savePrivateKey,
      refreshTime: getUser.data.refreshTime,
      theme: getUser.data.theme,
      lastOrganizationId: getUser.data.lastOrganizationId,
      email: getUser.data.email,
    });

    return 'ok';
  }
}
