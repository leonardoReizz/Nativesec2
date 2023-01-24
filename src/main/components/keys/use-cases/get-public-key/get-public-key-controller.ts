import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { GetPublicKeyUseCase } from './get-public-key-use-case';

export class GetPublicKeyController {
  constructor(private getPublicKeyUseCase: GetPublicKeyUseCase) {}

  async handle() {
    try {
      const message = await this.getPublicKeyUseCase.execute();

      console.log(message);
      return {
        response: IPCTypes.GET_PUBLIC_KEY_RESPONSE,
        data: {
          message,
        },
      };
    } catch (error) {
      return {
        response: IPCTypes.GET_PUBLIC_KEY_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
