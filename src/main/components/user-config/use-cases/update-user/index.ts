import { UserConfigRepositoryDatabase } from '../../repositories/user-config-repository-database';
import { UpdateUserController } from './update-user-config-controller';
import { UpdateUserConfigUseCase } from './update-user-config-use-case';

const userConfigRepositoryDatabase = new UserConfigRepositoryDatabase();
const updateUserConfigUseCase = new UpdateUserConfigUseCase(
  userConfigRepositoryDatabase
);
const updateUserConfigController = new UpdateUserController(
  updateUserConfigUseCase
);

export { updateUserConfigController };
