import { IUser } from '../../../../types';
import { store } from '../../../../main';
import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { IGenerateTokenRequestDTO } from './generate-token-request-dto';
import { GenerateTokenUseCase } from './generate-token-use-case';

export class GenerateTokenController {
  constructor(private generateTokenUseCase: GenerateTokenUseCase) {}

  async handle(data: IGenerateTokenRequestDTO) {
    try {
      const message = await this.generateTokenUseCase.execute(data);
      store.set('user', {
        ...(store.get('user') as IUser),
        myEmail: data.email,
      });
      return {
        response: IPCTypes.AUTH_PASSWORD_RESPONSE,
        data: {
          message,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        response: IPCTypes.AUTH_PASSWORD_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
