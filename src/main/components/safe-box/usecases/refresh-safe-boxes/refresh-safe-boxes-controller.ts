import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { IRefreshSafeBoxesRequestDTO } from './refresh-safe-boxes-request-dto';
import { RefreshSafeBoxesUseCase } from './refresh-safe-boxes-use-case';
import '@sentry/tracing';

export class RefreshSafeBoxesController {
  constructor(private refreshSafeBoxesUseCase: RefreshSafeBoxesUseCase) {}

  async handle(data: IRefreshSafeBoxesRequestDTO) {
    try {
      const message = await this.refreshSafeBoxesUseCase.execute(data);

      return {
        response: IPCTypes.REFRESH_SAFE_BOXES_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.REFRESH_SAFE_BOXES_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
