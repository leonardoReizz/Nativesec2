import { IPCTypes } from '@/types/IPCTypes';
import { VerifyUserPasswordUseCase } from './verify-user-password-use-case';

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
      return {
        response: IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
