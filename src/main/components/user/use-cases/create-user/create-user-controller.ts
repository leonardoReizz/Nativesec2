import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { ICreateUserRequestDTO } from './create-user-request-dto';
import { CreateUserUseCase } from './create-user-use-case';
import '@sentry/tracing';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(data: ICreateUserRequestDTO) {
    try {
      const message = await this.createUserUseCase.execute(data);

      return {
        response: IPCTypes.CREATE_USER_RESPONSE,
        data: {
          message,
        },
      };
    } catch (error) {
      Sentry.captureException(error);

      const messageError = (error as Error).message;
      return {
        response: IPCTypes.CREATE_USER_RESPONSE,
        data: {
          message: messageError,
        },
      };
    }
  }
}
