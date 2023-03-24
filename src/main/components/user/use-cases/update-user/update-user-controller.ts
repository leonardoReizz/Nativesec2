import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import { UpdateUserUseCase } from '@/main/components/user/use-cases/update-user/update-user-use-case';
import { IUpdateUserRequestDTO } from '@/main/components/user/use-cases/update-user/update-user-request-dto';

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async handle(data: IUpdateUserRequestDTO) {
    try {
      const message = await this.updateUserUseCase.execute(data);
      return {
        response: IPCTypes.UPDATE_USER_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.UPDATE_USER_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
