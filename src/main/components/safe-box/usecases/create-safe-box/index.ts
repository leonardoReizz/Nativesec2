import { KeyRepositoryAPI } from '../../../keys/repositories/key-repository-api';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { CreateSafeBoxController } from './create-safe-box-controller';
import { CreateSafeBoxUseCase } from './create-safe-box-usecase';

const safeBoxRepositoryAPI = new SafeBoxRepositoryAPI();
const keyRepositoryAPI = new KeyRepositoryAPI();
const safeBoxRepositoryDatabase = new SafeBoxRepositoryDatabase();

const createSafeBoxUseCase = new CreateSafeBoxUseCase(
  safeBoxRepositoryAPI,
  keyRepositoryAPI,
  safeBoxRepositoryDatabase
);

const createSafeBoxController = new CreateSafeBoxController(
  createSafeBoxUseCase
);

export { createSafeBoxController };
