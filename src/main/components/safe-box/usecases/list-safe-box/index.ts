import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { ListSafeBoxController } from './list-safe-box-controller';
import { ListSafeBoxUseCase } from './list-safe-box-use-case';

const safeBoxRepositoryDatabase = new SafeBoxRepositoryDatabase();

const listSafeBoxUseCase = new ListSafeBoxUseCase(safeBoxRepositoryDatabase);
const listSafeBoxController = new ListSafeBoxController(listSafeBoxUseCase);

export { listSafeBoxController };
