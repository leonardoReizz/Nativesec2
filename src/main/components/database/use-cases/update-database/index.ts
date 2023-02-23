import { DatabaseRepository } from '../../repositories/database-repository';
import { UpdateDatabaseController } from './update-database-controller';
import { UpdateDatabaseUseCase } from './update-database-use-case';

const databaseRepository = new DatabaseRepository();
const updateDatabaseUseCase = new UpdateDatabaseUseCase(databaseRepository);
const updateDatabaseController = new UpdateDatabaseController(
  updateDatabaseUseCase
);

export { updateDatabaseController };
