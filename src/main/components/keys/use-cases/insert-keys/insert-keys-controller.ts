import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { InsertKeysUseCase } from './insert-keys-use-case';
import '@sentry/tracing';

export class InsertKeysController {
  constructor(private insertKeysUseCase: InsertKeysUseCase) {}

  async handle() {
    try {
      const message = await this.insertKeysUseCase.execute();

      return {
        response: IPCTypes.INSERT_DATABASE_KEYS_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.INSERT_DATABASE_KEYS_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
