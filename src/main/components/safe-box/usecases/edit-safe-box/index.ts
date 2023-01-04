import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { EditSafeBoxController } from './edit-safe-box-controller';
import { EditSafeBoxUseCase } from './edit-safe-box-use-case';

const safeBoxRepositoryApi = new SafeBoxRepositoryAPI();
const safeBoxRepositoryDatabase = new SafeBoxRepositoryDatabase();
const editSafeBoxUseCase = new EditSafeBoxUseCase(
  safeBoxRepositoryApi,
  safeBoxRepositoryDatabase
);
const editSafeBoxController = new EditSafeBoxController(editSafeBoxUseCase);

export { editSafeBoxController };
