import { KeyRepositoryAPI } from '../../../keys/repositories/key-repository-api';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { AddUsersController } from './add-users-controler';
import { AddUsersUseCase } from './add-users-use-case';

const safeBoxRepositoryDatabase = new SafeBoxRepositoryDatabase();
const safeBoxRepositoryAPI = new SafeBoxRepositoryAPI();
const keyRepositoryAPI = new KeyRepositoryAPI();

const addUsersUseCase = new AddUsersUseCase(
  safeBoxRepositoryAPI,
  safeBoxRepositoryDatabase,
  keyRepositoryAPI
);

const addUsersController = new AddUsersController(addUsersUseCase);

export { addUsersController };
