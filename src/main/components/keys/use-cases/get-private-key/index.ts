import { KeyRepositoryAPI } from '../../repositories/key-repository-api';
import { KeyRepositoryDatabase } from '../../repositories/key-repository-database';
import { GetPrivateKeyController } from './get-private-key-controller';
import { GetPrivateKeyUseCase } from './get-private-key-use-case';

const keyRepositoryAPI = new KeyRepositoryAPI();
const keyRepositoryDatabase = new KeyRepositoryDatabase();

const getPrivateKeyUseCase = new GetPrivateKeyUseCase(
  keyRepositoryDatabase,
  keyRepositoryAPI
);
const getPrivateKeyController = new GetPrivateKeyController(
  getPrivateKeyUseCase
);

export { getPrivateKeyController };
