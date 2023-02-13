import { IPCTypes } from '@/types/IPCTypes';
import { IAddUsersRequestDTO } from './add-users-request-dto';
import { AddUsersUseCase } from './add-users-use-case';

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
      return {
        response: IPCTypes.ADD_SAFE_BOX_USERS_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
