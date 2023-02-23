import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { CreateSafeBoxRequestDTO } from './create-safe-box-request-dto';
import { CreateSafeBoxUseCase } from './create-safe-box-usecase';
import '@sentry/tracing';

export class CreateSafeBoxController {
  constructor(private createSafeBoxUseCase: CreateSafeBoxUseCase) {}

  async handle(data: CreateSafeBoxRequestDTO) {
    try {
      const message = await this.createSafeBoxUseCase.execute(data);
      return {
        response: IPCTypes.CREATE_SAFE_BOX_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.CREATE_SAFE_BOX_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
