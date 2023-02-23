import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { VerifyUserPasswordUseCase } from './verify-user-password-use-case';
import '@sentry/tracing';

export class VerifyUserPasswordController {
  constructor(private verifyUserPasswordUseCase: VerifyUserPasswordUseCase) {}

  async handle() {
    try {
      const message = await this.verifyUserPasswordUseCase.execute();

      return {
        response: IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
