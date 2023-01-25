import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { ICreateUserRequestDTO } from './create-user-request-dto';
import { CreateUserUseCase } from './create-user-use-case';

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
      console.log(error);

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
