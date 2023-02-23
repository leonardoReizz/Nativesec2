import { KeyRepositoryAPI } from '../../repositories/key-repository-api';
import { KeyRepositoryDatabase } from '../../repositories/key-repository-database';
import { GetPublicKeyController } from './get-public-key-controller';
import { GetPublicKeyUseCase } from './get-public-key-use-case';

const keyRepositoryDatabase = new KeyRepositoryDatabase();
const keyRepositoryApi = new KeyRepositoryAPI();

const getPublicKeyUseCae = new GetPublicKeyUseCase(
  keyRepositoryDatabase,
  keyRepositoryApi
);
const getPublicKeyController = new GetPublicKeyController(getPublicKeyUseCae);

export { getPublicKeyController };
