import { KeyRepositoryAPI } from '../../repositories/key-repository-api';
import { DeletePrivateKeyController } from './delete-private-key-controller';
import { DeletePrivateKeyUseCase } from './delete-private-key-use-case';

const keyRepositoryAPI = new KeyRepositoryAPI();

const deletePrivateKeyUseCase = new DeletePrivateKeyUseCase(keyRepositoryAPI);

const deletePrivateKeyController = new DeletePrivateKeyController(
  deletePrivateKeyUseCase
);

export { deletePrivateKeyController };
