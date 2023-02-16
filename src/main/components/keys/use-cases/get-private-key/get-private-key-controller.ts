import * as Sentry from '@sentry/node';
import { IPCTypes } from '@/types/IPCTypes';
import { GetPrivateKeyUseCase } from './get-private-key-use-case';
import '@sentry/tracing';

export class GetPrivateKeyController {
  constructor(private getPrivateKeyUseCase: GetPrivateKeyUseCase) {}

  async handle() {
    try {
      const message = await this.getPrivateKeyUseCase.execute();
      return {
        response: IPCTypes.GET_PRIVATE_KEY_RESPONSE,
        data: {
          message,
        },
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.GET_PRIVATE_KEY_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
