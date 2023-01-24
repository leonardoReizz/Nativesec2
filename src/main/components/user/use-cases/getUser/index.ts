import { UserRepositoryAPI } from '../../repositories/user-repository-api';
import { GetUserController } from './get-user-controller';
import { GetUserUseCase } from './get-user-use-case';

const userRepositoryAPI = new UserRepositoryAPI();
const getUserUseCase = new GetUserUseCase(userRepositoryAPI);
const getUserController = new GetUserController(getUserUseCase);

export { getUserController };
