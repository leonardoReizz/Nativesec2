import { SafeBoxGroupRepositoryAPI } from '../../repositories/safe-box-group-repository-API';
import { SafeBoxGroupRepositoryDatabase } from '../../repositories/safe-box-group-repository-database';
import { DeleteSafeBoxGroupController } from './delete-safe-box-group-controller';
import { DeleteSafeBoxGroupUseCase } from './delete-safe-box-group-use-case';

const safeBoxGroupRepositoryAPI = new SafeBoxGroupRepositoryAPI();
const safeBoxGroupRepositoryDatabase = new SafeBoxGroupRepositoryDatabase();

const deleteSafeBoxGroupUseCase = new DeleteSafeBoxGroupUseCase(
  safeBoxGroupRepositoryAPI,
  safeBoxGroupRepositoryDatabase
);

const deleteSafeBoxGroupController = new DeleteSafeBoxGroupController(
  deleteSafeBoxGroupUseCase
);

export { deleteSafeBoxGroupController };
