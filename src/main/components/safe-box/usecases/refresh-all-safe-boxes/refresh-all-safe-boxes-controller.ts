import * as Sentry from '@sentry/node';
import { IPCTypes } from '@/types/IPCTypes';
import { RefreshAllSafeBoxesUseCase } from './refresh-all-safe-boxes-use-case';
import '@sentry/tracing';

export class RefreshAllSafeBoxesController {
  constructor(private refreshAllSafeBoxesUseCase: RefreshAllSafeBoxesUseCase) {}

  async handle() {
    try {
      const message = await this.refreshAllSafeBoxesUseCase.execute();
      console.log(message)
      return {
        response: IPCTypes.REFRESH_ALL_SAFE_BOXES_RESPONSE,
        data: message,
      };
    } catch (error) {
      console.log(error)
      Sentry.captureException(error);
      return {
        response: IPCTypes.REFRESH_ALL_SAFE_BOXES_RESPONSE,
        data: {
          message: 'ok',
        },
      };
    }
  }
}
