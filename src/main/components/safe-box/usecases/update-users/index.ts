import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { UpdateUsersSafeBoxController } from './update-users-safe-box-controller';
import { UpdateUsersSafeBoxUseCase } from './update-users-safe-box-use-case';

const safeBoxRepositoryApi = new SafeBoxRepositoryAPI();
const safeBoxRepositoryDatabase = new SafeBoxRepositoryDatabase();
const updateUsersSafeBoxUseCase = new UpdateUsersSafeBoxUseCase(
  safeBoxRepositoryApi,
  safeBoxRepositoryDatabase
);
const updateUsersSafeBoxController = new UpdateUsersSafeBoxController(
  updateUsersSafeBoxUseCase
);

export { updateUsersSafeBoxController };
