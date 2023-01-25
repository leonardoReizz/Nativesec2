import { KeyRepositoryAPI } from 'main/components/keys/repositories/key-repository-api';
import { KeyRepositoryDatabase } from 'main/components/keys/repositories/key-repository-database';
import { VerifyUserRegisteredController } from './verify-user-registered-controller';
import { VerifyUserRegisteredUseCase } from './verify-user-registered-use-case';

const keyRepositoryAPI = new KeyRepositoryAPI();
const keyRepositoryDatabase = new KeyRepositoryDatabase();

const verifyUserRegisteredUseCase = new VerifyUserRegisteredUseCase(
  keyRepositoryAPI,
  keyRepositoryDatabase
);
const verifyUserRegisteredController = new VerifyUserRegisteredController(
  verifyUserRegisteredUseCase
);

export { verifyUserRegisteredController };
