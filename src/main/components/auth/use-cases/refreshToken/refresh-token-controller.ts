import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { RefreshTokenUseCase } from './refresh-token-use-case';

export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {}

  async handle() {
    try {
      const message = await this.refreshTokenUseCase.execute();

      return {
        response: IPCTypes.REFRESH_TOKEN,
        data: message,
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
