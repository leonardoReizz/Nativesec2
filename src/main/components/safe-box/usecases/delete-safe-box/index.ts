import { SafeBoxGroupRepositoryAPI } from '@/main/components/safe-box-group/repositories/safe-box-group-repository-API';
import { SafeBoxGroupRepositoryDatabase } from '@/main/components/safe-box-group/repositories/safe-box-group-repository-database';
import { RefreshAllSafeBoxGroupUseCase } from '@/main/components/safe-box-group/use-cases/refresh-all-safe-box-group/refresh-all-safe-box-group-use-case';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import DeleteSafeBoxController from './delete-safe-box-controller';
import { DeleteSafeBoxUseCase } from './delete-safe-box-usecase';

const safeBoxRepositoryAPI = new SafeBoxRepositoryAPI();
const safeBoxRepositoryDatabase = new SafeBoxRepositoryDatabase();
const safeBoxGroupRepositoryAPI = new SafeBoxGroupRepositoryAPI();
const safeBoxGroupRepositoryDatabase = new SafeBoxGroupRepositoryDatabase();
const refreshAllSafeBoxGroupUseCase = new RefreshAllSafeBoxGroupUseCase(
  safeBoxGroupRepositoryAPI,
  safeBoxGroupRepositoryDatabase
);

const deleteSafeBoxUseCase = new DeleteSafeBoxUseCase(
  safeBoxRepositoryAPI,
  safeBoxRepositoryDatabase,
  safeBoxGroupRepositoryDatabase,
  refreshAllSafeBoxGroupUseCase
);

const deleteSafeBoxController = new DeleteSafeBoxController(
  deleteSafeBoxUseCase
);

export { deleteSafeBoxController };
