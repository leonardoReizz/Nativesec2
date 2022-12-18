import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import DeleteSafeBoxController from './delete-safe-box-controller';
import { DeleteSafeBoxUseCase } from './delete-safe-box-usecase';

const safeBoxRepositoryAPI = new SafeBoxRepositoryAPI();
const safeBoxRepositoryDatabase = new SafeBoxRepositoryDatabase();

const deleteSafeBoxUseCase = new DeleteSafeBoxUseCase(
  safeBoxRepositoryAPI,
  safeBoxRepositoryDatabase
);

const deleteSafeBoxController = new DeleteSafeBoxController(
  deleteSafeBoxUseCase
);

export { deleteSafeBoxController };
