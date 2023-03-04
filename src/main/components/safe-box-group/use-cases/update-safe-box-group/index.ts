import { SafeBoxGroupRepositoryAPI } from '../../repositories/safe-box-group-repository-API';
import { SafeBoxGroupRepositoryDatabase } from '../../repositories/safe-box-group-repository-database';
import { UpdateSafeBoxGroupController } from './update-safe-box-group-controller';
import { UpdateSafeBoxGroupUseCase } from './update-safe-box-group-use-case';

const safeBoxGroupRepositoryAPI = new SafeBoxGroupRepositoryAPI();
const safeBoxGroupRepositoryDatabase = new SafeBoxGroupRepositoryDatabase();

const updateSafeBoxGroupUseCase = new UpdateSafeBoxGroupUseCase(
  safeBoxGroupRepositoryAPI,
  safeBoxGroupRepositoryDatabase
);
const updateSafeBoxGroupController = new UpdateSafeBoxGroupController(
  updateSafeBoxGroupUseCase
);

export { updateSafeBoxGroupController };
