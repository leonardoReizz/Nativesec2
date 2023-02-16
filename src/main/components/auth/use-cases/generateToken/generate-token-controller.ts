import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { IGenerateTokenRequestDTO } from './generate-token-request-dto';
import { GenerateTokenUseCase } from './generate-token-use-case';
import '@sentry/tracing';

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
      Sentry.captureException(error);
      return {
        response: IPCTypes.AUTH_PASSWORD_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
