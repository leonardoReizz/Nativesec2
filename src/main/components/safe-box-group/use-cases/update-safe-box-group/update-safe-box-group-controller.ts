import * as Sentry from '@sentry/node';
import { IPCTypes } from '@/types/IPCTypes';
import { UpdateSafeBoxGroupRequestDTO } from './update-safe-box-group-request-dto';
import { UpdateSafeBoxGroupUseCase } from './update-safe-box-group-use-case';
import '@sentry/tracing';

export class UpdateSafeBoxGroupController {
  constructor(private updateSafeBoxGroupUseCase: UpdateSafeBoxGroupUseCase) {}

  async handle(data: UpdateSafeBoxGroupRequestDTO) {
    try {
      const message = await this.updateSafeBoxGroupUseCase.execute(data);

      return {
        response: IPCTypes.UPDATE_SAFE_BOX_GROUP_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.UPDATE_SAFE_BOX_GROUP_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
