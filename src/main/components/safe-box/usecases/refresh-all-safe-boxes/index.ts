import { OrganizationRepositoryAPI } from '../../../organizations/repositories/organization-repository-api';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { RefreshSafeBoxesUseCase } from '../refresh-safe-boxes/refresh-safe-boxes-use-case';
import { RefreshAllSafeBoxesController } from './refresh-all-safe-boxes-controller';
import { RefreshAllSafeBoxesUseCase } from './refresh-all-safe-boxes-use-case';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();
const safeBoxRepositoryAPI = new SafeBoxRepositoryAPI();
const safeBoxRepositoryDatabase = new SafeBoxRepositoryDatabase();

const refreshSafeBoxesUseCase = new RefreshSafeBoxesUseCase(
  safeBoxRepositoryAPI,
  safeBoxRepositoryDatabase
);

const refreshAllSafeBoxesUseCase = new RefreshAllSafeBoxesUseCase(
  organizationRepositoryAPI,
  refreshSafeBoxesUseCase
);
const refreshAllSafeBoxesController = new RefreshAllSafeBoxesController(
  refreshAllSafeBoxesUseCase
);

export { refreshAllSafeBoxesController };
