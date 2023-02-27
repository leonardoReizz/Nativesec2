import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { RefreshAllSafeBoxGroupUseCase } from './refresh-all-safe-box-group-use-case';
import '@sentry/tracing';

export class RefreshAllSafeBoxGroupController {
  constructor(
    private refreshAllSafeBoxGroupUseCase: RefreshAllSafeBoxGroupUseCase
  ) {}

  async handle() {
    console.log('refresh group all');
    try {
      const message = await this.refreshAllSafeBoxGroupUseCase.execute();
      return {
        response: IPCTypes.REFRESH_ALL_SAFE_BOX_GROUP_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.REFRESH_ALL_SAFE_BOX_GROUP_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
