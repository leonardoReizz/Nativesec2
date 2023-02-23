import { UserRepositoryDatabase } from '../../repositories/user-repository-database';
import { VerifyUserPasswordController } from './verify-user-password-controller';
import { VerifyUserPasswordUseCase } from './verify-user-password-use-case';

const userRepositoryDatabase = new UserRepositoryDatabase();

const verifyUserPasswordUseCase = new VerifyUserPasswordUseCase(
  userRepositoryDatabase
);
const verifyUserPasswordController = new VerifyUserPasswordController(
  verifyUserPasswordUseCase
);

export { verifyUserPasswordController };
