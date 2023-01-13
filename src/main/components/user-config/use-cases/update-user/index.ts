import { KeyRepositoryAPI } from 'main/components/keys/repositories/key-repository-api';
import { UserConfigRepositoryDatabase } from '../../repositories/user-config-repository-database';
import { UpdateUserController } from './update-user-config-controller';
import { UpdateUserConfigUseCase } from './update-user-config-use-case';

const userConfigRepositoryDatabase = new UserConfigRepositoryDatabase();
const keyRepositoryAPI = new KeyRepositoryAPI();
const updateUserConfigUseCase = new UpdateUserConfigUseCase(
  userConfigRepositoryDatabase,
  keyRepositoryAPI
);
const updateUserConfigController = new UpdateUserController(
  updateUserConfigUseCase
);

export { updateUserConfigController };
