import { KeyRepositoryAPI } from '../../../keys/repositories/key-repository-api';
import { UserConfigRepositoryDatabase } from '../../repositories/user-config-repository-database';
import { SetUserConfigController } from './set-user-config-controller';
import { SetUserConfigUseCase } from './set-user-config-use-case';

const userConfigRepositoryDatabase = new UserConfigRepositoryDatabase();
const keyRepositoryAPI = new KeyRepositoryAPI();

const setUserConfigUseCase = new SetUserConfigUseCase(
  userConfigRepositoryDatabase,
  keyRepositoryAPI
);
const setUserConfigController = new SetUserConfigController(
  setUserConfigUseCase
);

export { setUserConfigController };
