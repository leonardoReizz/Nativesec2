import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { IUpdateSafeBoxRequestDTO } from './update-safe-box-request-dto';
import { UpdateSafeBoxUseCase } from './update-safe-box-use-case';
import '@sentry/tracing';

export class UpdateSafeBoxController {
  constructor(private updateSafeBoxUseCase: UpdateSafeBoxUseCase) {}

  async handle(data: IUpdateSafeBoxRequestDTO) {
    try {
      const message = await this.updateSafeBoxUseCase.execute(data);

      return {
        response: IPCTypes.UPDATE_SAFE_BOX_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.UPDATE_SAFE_BOX_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
