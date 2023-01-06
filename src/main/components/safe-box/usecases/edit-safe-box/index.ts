import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';

import { UpdateSafeBoxController } from './update-safe-box-controller';
import { UpdateSafeBoxUseCase } from './update-safe-box-use-case';

const safeBoxRepositoryApi = new SafeBoxRepositoryAPI();
const safeBoxRepositoryDatabase = new SafeBoxRepositoryDatabase();
const updateSafeBoxUseCase = new UpdateSafeBoxUseCase(
  safeBoxRepositoryApi,
  safeBoxRepositoryDatabase
);
const updateSafeBoxController = new UpdateSafeBoxController(
  updateSafeBoxUseCase
);

export { updateSafeBoxController };
