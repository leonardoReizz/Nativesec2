import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { RefreshSafeBoxesController } from './refresh-safe-boxes-controller';
import { RefreshSafeBoxesUseCase } from './refresh-safe-boxes-use-case';

const safeBoxRepositoryAPI = new SafeBoxRepositoryAPI();
const safeBoxRepositoryDatabase = new SafeBoxRepositoryDatabase();

const refreshSafeBoxesUseCase = new RefreshSafeBoxesUseCase(
  safeBoxRepositoryAPI,
  safeBoxRepositoryDatabase
);
const refreshSafeBoxesController = new RefreshSafeBoxesController(
  refreshSafeBoxesUseCase
);

export { refreshSafeBoxesController };
