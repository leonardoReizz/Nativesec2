import { store } from '../../../../main';
import { UserRepositoryAPI } from '../../repositories/user-repository-api';
import { ICreateUserRequestDTO } from './create-user-request-dto';

export class CreateUserUseCase {
  constructor(private userRepositoryAPI: UserRepositoryAPI) {}

  async execute(data: ICreateUserRequestDTO) {
    console.log(data);

    const createUser = await this.userRepositoryAPI.create({
      full_name: data.fullName,
      email: data.email.toLowerCase(),
    });

    console.log(createUser);

    if (createUser.status === 200 && createUser.data.status === 'ok') {
      store.set('register', { register: true });
      store.set('user', {
        myEmail: data.email,
        myFullName: data.fullName,
        safetyPhrase: data.safetyPhrase,
      });
      return 'ok';
    }

    if (createUser.data.msg === 'Account exists')
      throw new Error('accountExists');
    throw new Error('nok');
  }
}
