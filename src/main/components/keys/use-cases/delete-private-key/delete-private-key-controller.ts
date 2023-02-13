import { IPCTypes } from '@/types/IPCTypes';
import { DeletePrivateKeyRequestDTO } from './delete-private-key-request-dto';
import { DeletePrivateKeyUseCase } from './delete-private-key-use-case';

export class DeletePrivateKeyController {
  constructor(private deletePrivateKeyUseCase: DeletePrivateKeyUseCase) {}

  async handle(data: DeletePrivateKeyRequestDTO) {
    try {
      await this.deletePrivateKeyUseCase.execute(data);

      return {
        response: IPCTypes.DELETE_PRIVATE_KEY_RESPONSE,
        data: {
          message: 'ok',
        },
      };
    } catch (error) {
      return {
        response: IPCTypes.DELETE_PRIVATE_KEY_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
