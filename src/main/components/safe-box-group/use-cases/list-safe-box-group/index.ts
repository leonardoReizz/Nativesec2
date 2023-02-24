import { SafeBoxGroupRepositoryDatabase } from '../../repositories/safe-box-group-repository-database';
import { ListSafeBoxGroupController } from './list-safe-box-group-controller';
import { ListSafeBoxGroupUseCase } from './list-safe-box-group-use-case';

const safeBoxGroupRepositoryDatabase = new SafeBoxGroupRepositoryDatabase();
const listSafeBoxGroupUseCase = new ListSafeBoxGroupUseCase(
  safeBoxGroupRepositoryDatabase
);
const listSafeBoxGroupController = new ListSafeBoxGroupController(
  listSafeBoxGroupUseCase
);

export { listSafeBoxGroupController };
