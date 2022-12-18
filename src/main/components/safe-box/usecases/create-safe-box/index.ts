import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { CreateSafeBoxController } from './create-safe-box-controller';
import { CreateSafeBoxUseCase } from './create-safe-box-usecase';

const safeBoxRepositoryAPI = new SafeBoxRepositoryAPI();
const safeBoxRepositoryDatabase = new SafeBoxRepositoryDatabase();

const createSafeBoxUseCase = new CreateSafeBoxUseCase(
  safeBoxRepositoryAPI,
  safeBoxRepositoryDatabase
);

const createSafeBoxController = new CreateSafeBoxController(
  createSafeBoxUseCase
);

export { createSafeBoxController };
