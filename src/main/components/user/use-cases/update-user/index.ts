import { UpdateUserConfigUseCase } from '@/main/components/user/use-cases/update-user/update-user-use-case';
import { UserRepositoryDatabase } from '@/main/components/user/repositories/user-repository-database';
import { UpdateUserConfigController } from './update-user-controller';

const userRepositoryDatabase = new UserRepositoryDatabase();
const updateUserConfigUseCase = new UpdateUserConfigUseCase(
  userRepositoryDatabase
);
const updateUserConfigController = new UpdateUserConfigController(
  updateUserConfigUseCase
);
export { updateUserConfigController };
