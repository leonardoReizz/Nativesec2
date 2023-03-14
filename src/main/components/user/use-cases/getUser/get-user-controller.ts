import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { GetUserUseCase } from './get-user-use-case';
import '@sentry/tracing';

export class GetUserController {
  constructor(private getUserUseCase: GetUserUseCase) {}

  async handle() {
    try {
      const message = await this.getUserUseCase.execute();

      return {
        response: IPCTypes.GET_USER_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.GET_USER_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
