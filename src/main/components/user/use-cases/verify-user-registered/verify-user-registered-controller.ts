import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { IVerifyUserRegisteredRequestDTO } from './verify-user-registered-request-dto';
import { VerifyUserRegisteredUseCase } from './verify-user-registered-use-case';
import '@sentry/tracing';

export class VerifyUserRegisteredController {
  constructor(
    private verifyUserRegisteredUseCase: VerifyUserRegisteredUseCase
  ) {}

  async handle(data: IVerifyUserRegisteredRequestDTO) {
    try {
      const message = await this.verifyUserRegisteredUseCase.execute(data);

      return {
        response: IPCTypes.VERIFY_USER_REGISTERED_RESPONSE,
        data: {
          message,
        },
      };
    } catch (error) {
      Sentry.captureException(error);
      const errorMessage = (error as Error).message;

      return {
        response: IPCTypes.VERIFY_USER_REGISTERED_RESPONSE,
        data: {
          message: errorMessage,
        },
      };
    }
  }
}
