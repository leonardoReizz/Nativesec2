import { KeyRepositoryAPI } from '../../../keys/repositories/key-repository-api';
import { UserRepositoryAPI } from '../../repositories/user-repository-api';
import { VerifyUserRegisteredController } from './verify-user-registered-controller';
import { VerifyUserRegisteredUseCase } from './verify-user-registered-use-case';

const keyRepositoryAPI = new KeyRepositoryAPI();
const userRepositoryAPI = new UserRepositoryAPI();

const verifyUserRegisteredUseCase = new VerifyUserRegisteredUseCase(
  keyRepositoryAPI,
  userRepositoryAPI
);
const verifyUserRegisteredController = new VerifyUserRegisteredController(
  verifyUserRegisteredUseCase
);

export { verifyUserRegisteredController };
