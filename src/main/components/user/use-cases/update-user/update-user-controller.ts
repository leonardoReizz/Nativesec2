import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import { UpdateUserConfigUseCase } from '@/main/components/user/use-cases/update-user/update-user-use-case';
import { IUpdateUserConfigRequestDTO } from '@/main/components/user/use-cases/update-user/update-user-request-dto';

export class UpdateUserConfigController {
  constructor(private updateUserConfigUseCase: UpdateUserConfigUseCase) {}

  async handle(data: IUpdateUserConfigRequestDTO) {
    try {
      const message = await this.updateUserConfigUseCase.execute(data);
      return {
        response: IPCTypes.UPDATE_USER_CONFIG_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.UPDATE_USER_CONFIG_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
