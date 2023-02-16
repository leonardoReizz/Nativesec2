import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { DeletePrivateKeyRequestDTO } from './delete-private-key-request-dto';
import { DeletePrivateKeyUseCase } from './delete-private-key-use-case';
import '@sentry/tracing';

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
      Sentry.captureException(error);
      return {
        response: IPCTypes.DELETE_PRIVATE_KEY_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
