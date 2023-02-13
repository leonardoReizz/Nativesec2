import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { ForceRefreshSafeBoxesController } from './force-refresh-safe-boxes-controller';
import { ForceRefreshSafeBoxesUseCase } from './force-refresh-safe-boxes-use-case';

const safeBoxRepositoryAPI = new SafeBoxRepositoryAPI();
const safeBoxRepositoryDatabase = new SafeBoxRepositoryDatabase();

const forceRefreshSafeBoxesUseCase = new ForceRefreshSafeBoxesUseCase(
  safeBoxRepositoryDatabase,
  safeBoxRepositoryAPI
);
const forceRefreshSafeBoxesController = new ForceRefreshSafeBoxesController(
  forceRefreshSafeBoxesUseCase
);

export { forceRefreshSafeBoxesController };
