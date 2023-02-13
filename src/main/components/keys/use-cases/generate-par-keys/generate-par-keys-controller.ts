import { IPCTypes } from '@/types/IPCTypes';
import { IGenerateParKeysRequestDTO } from './generate-par-key-request-dto';
import { GenerateParKeysUseCase } from './generate-par-keys-use-case';

export class GenerateParKeysController {
  constructor(private generateParKeysUseCase: GenerateParKeysUseCase) {}

  async handle(data: IGenerateParKeysRequestDTO) {
    try {
      const message = await this.generateParKeysUseCase.execute(data);

      return {
        response: IPCTypes.GENERATE_PAR_KEYS_RESPONSE,
        data: message,
      };
    } catch (error) {
      return {
        response: IPCTypes.GENERATE_PAR_KEYS_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
