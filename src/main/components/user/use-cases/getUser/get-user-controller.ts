import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { GetUserUseCase } from './get-user-use-case';

export class GetUserController {
  constructor(private getUserUseCase: GetUserUseCase) {}

  async handle() {
    const message = await this.getUserUseCase.execute();

    try {
      await this.getUserUseCase.execute();

      return {
        response: IPCTypes.GET_USER_RESPONSE,
        data: {
          message,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        response: IPCTypes.GET_USER_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
