import { SafeBoxGroupRepositoryAPI } from '../../repositories/safe-box-group-repository-API';
import { SafeBoxGroupRepositoryDatabase } from '../../repositories/safe-box-group-repository-database';
import { RefreshAllSafeBoxGroupController } from './refresh-all-safe-box-group-controller';
import { RefreshAllSafeBoxGroupUseCase } from './refresh-all-safe-box-group-use-case';

const safeBoxGroupRepositoryAPI = new SafeBoxGroupRepositoryAPI();
const safeBoxGroupRepositoryDatabase = new SafeBoxGroupRepositoryDatabase();

const refreshAllSafeBoxGroupUseCase = new RefreshAllSafeBoxGroupUseCase(
  safeBoxGroupRepositoryAPI,
  safeBoxGroupRepositoryDatabase
);
const refreshAllSafeBoxGroupController = new RefreshAllSafeBoxGroupController(
  refreshAllSafeBoxGroupUseCase
);

export { refreshAllSafeBoxGroupController };
