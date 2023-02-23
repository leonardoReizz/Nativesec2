import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { UpdateDatabaseUseCase } from './update-database-use-case';
import '@sentry/tracing';

export class UpdateDatabaseController {
  constructor(private updateDatabaseUseCase: UpdateDatabaseUseCase) {}

  async handle() {
    try {
      const message = await this.updateDatabaseUseCase.execute();
      return {
        response: IPCTypes.UPDATE_DATABASE_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.UPDATE_DATABASE_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
