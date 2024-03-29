import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { GetPrivateKeyUseCase } from './get-private-key-use-case';

export class GetPrivateKeyController {
  constructor(private getPrivateKeyUseCase: GetPrivateKeyUseCase) {}

  async handle() {
    try {
      const message = await this.getPrivateKeyUseCase.execute();
      return {
        response: IPCTypes.GET_PRIVATE_KEY_RESPONSE,
        data: {
          message,
        },
      };
    } catch (error) {
      return {
        response: IPCTypes.GET_PRIVATE_KEY_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
