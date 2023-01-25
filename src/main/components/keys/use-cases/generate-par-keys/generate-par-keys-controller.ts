import { IPCTypes } from 'renderer/@types/IPCTypes';

export class GenerateParKeysController {
  constructor(generateParKeysUseCase: GenerateParKeysUseCase) {}

  async handle() {
    try {
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
