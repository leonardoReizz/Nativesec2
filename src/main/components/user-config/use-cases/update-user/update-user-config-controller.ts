import { IUser } from '../../../../types';
import { store } from '../../../../main';
import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { UpdateUserConfigRequestDTO } from './update-user-config-request-dto';
import { UpdateUserConfigUseCase } from './update-user-config-use-case';

export class UpdateUserController {
  constructor(private updateUserConfigUseCase: UpdateUserConfigUseCase) {}

  async handle(data: UpdateUserConfigRequestDTO) {
    let message = 'ok';
    try {
      const { myEmail } = store.get('user') as IUser;
      await this.updateUserConfigUseCase.execute({ ...data, email: myEmail });

      if (data.type === 'lastOrganizationId') {
        message = 'ok, not callback';
      }

      return {
        response: IPCTypes.UPDATE_USER_CONFIG_RESPONSE,
        data: {
          message,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        response: IPCTypes.UPDATE_USER_CONFIG_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
