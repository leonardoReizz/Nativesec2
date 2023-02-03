import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { IUpdateUsersSafeBoxRequestDTO } from './update-users-safe-box-request-dto';
import { UpdateUsersSafeBoxUseCase } from './update-users-safe-box-use-case';

export class UpdateUsersSafeBoxController {
  constructor(private updateUsersSafeBoxUseCase: UpdateUsersSafeBoxUseCase) {}

  async handle(data: IUpdateUsersSafeBoxRequestDTO) {
    try {
      await this.updateUsersSafeBoxUseCase.execute(data);

      return {
        response: IPCTypes.UPDATE_USERS_SAFE_BOX_CONTROLLER,
        data: {
          message: 'ok',
        },
      };
    } catch (error) {
      return {
        response: IPCTypes.UPDATE_USERS_SAFE_BOX_CONTROLLER,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
