import { IPCTypes } from '@/types/IPCTypes';
import { IGenerateTokenRequestDTO } from './generate-token-request-dto';
import { GenerateTokenUseCase } from './generate-token-use-case';

export class GenerateTokenController {
  constructor(private generateTokenUseCase: GenerateTokenUseCase) {}

  async handle(data: IGenerateTokenRequestDTO) {
    try {
      const message = await this.generateTokenUseCase.execute(data);

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
