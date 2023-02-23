import { KeyRepositoryDatabase } from '../../repositories/key-repository-database';
import { InsertKeysController } from './insert-keys-controller';
import { InsertKeysUseCase } from './insert-keys-use-case';

const keyRepositoryDatabase = new KeyRepositoryDatabase();

const insertKeysUseCase = new InsertKeysUseCase(keyRepositoryDatabase);
const insertKeysController = new InsertKeysController(insertKeysUseCase);

export { insertKeysController };
