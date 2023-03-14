import { UserRepositoryDatabase } from '@/main/components/user/repositories/user-repository-database';
import { KeyRepositoryAPI } from '@/main/components/keys/repositories/key-repository-api';
import { UserRepositoryAPI } from '../../repositories/user-repository-api';
import { GetUserController } from './get-user-controller';
import { GetUserUseCase } from './get-user-use-case';

const userRepositoryAPI = new UserRepositoryAPI();
const userRepositoryDatabase = new UserRepositoryDatabase();
const keyRepositoryAPI = new KeyRepositoryAPI();
const getUserUseCase = new GetUserUseCase(
  userRepositoryAPI,
  userRepositoryDatabase,
  keyRepositoryAPI
);
const getUserController = new GetUserController(getUserUseCase);

export { getUserController };
