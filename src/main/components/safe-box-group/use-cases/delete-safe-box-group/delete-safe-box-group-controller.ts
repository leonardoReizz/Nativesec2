import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import { IDeleteSafeBoxGroupRequestDTO } from './delete-safe-box-group-request-dto';
import { DeleteSafeBoxGroupUseCase } from './delete-safe-box-group-use-case';

export class DeleteSafeBoxGroupController {
  constructor(private deleteSafeBoxGroupUseCase: DeleteSafeBoxGroupUseCase) {}

  async handle(data: IDeleteSafeBoxGroupRequestDTO) {
    try {
      const message = await this.deleteSafeBoxGroupUseCase.execute(data);

      return {
        response: IPCTypes.DELETE_SAFE_BOX_GROUP_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.DELETE_SAFE_BOX_GROUP_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
