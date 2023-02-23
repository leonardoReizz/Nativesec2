import * as Sentry from '@sentry/node';
import { IPCTypes } from '@/types/IPCTypes';
import { GetPublicKeyUseCase } from './get-public-key-use-case';
import '@sentry/tracing';

export class GetPublicKeyController {
  constructor(private getPublicKeyUseCase: GetPublicKeyUseCase) {}

  async handle() {
    try {
      const message = await this.getPublicKeyUseCase.execute();

      return {
        response: IPCTypes.GET_PUBLIC_KEY_RESPONSE,
        data: {
          message,
        },
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.GET_PUBLIC_KEY_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
