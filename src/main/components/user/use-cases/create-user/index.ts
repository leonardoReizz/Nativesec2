import { UserRepositoryAPI } from '../../repositories/user-repository-api';
import { CreateUserController } from './create-user-controller';
import { CreateUserUseCase } from './create-user-use-case';

const userRepositoryAPI = new UserRepositoryAPI();
const createUserUseCase = new CreateUserUseCase(userRepositoryAPI);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
