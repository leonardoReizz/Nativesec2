import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { IAddUsersRequestDTO } from './add-users-request-dto';
import { AddUsersUseCase } from './add-users-use-case';
import '@sentry/tracing';

export class AddUsersController {
  constructor(private addUsersUseCase: AddUsersUseCase) {}

  async handle(data: IAddUsersRequestDTO) {
    try {
      const message = await this.addUsersUseCase.execute(data);
      return {
        response: IPCTypes.ADD_SAFE_BOX_USERS_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.ADD_SAFE_BOX_USERS_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
