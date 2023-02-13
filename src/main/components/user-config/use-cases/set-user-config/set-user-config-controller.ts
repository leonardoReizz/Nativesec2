import { IPCTypes } from '@/types/IPCTypes';
import { SetUserConfigUseCase } from './set-user-config-use-case';

export class SetUserConfigController {
  constructor(private setUserConfigUseCase: SetUserConfigUseCase) {}

  async handle() {
    try {
      const message = await this.setUserConfigUseCase.execute();
      return {
        response: IPCTypes.SET_USER_CONFIG_RESPONSE,
        data: {
          message,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        response: IPCTypes.SET_USER_CONFIG_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
