import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { CreateSafeBoxRequestDTO } from './create-safe-box-request-dto';
import { CreateSafeBoxUseCase } from './create-safe-box-usecase';

export class CreateSafeBoxController {
  constructor(private createSafeBoxUseCase: CreateSafeBoxUseCase) {}

  async handle(data: CreateSafeBoxRequestDTO) {
    try {
      await this.createSafeBoxUseCase.execute(data);
      return {
        response: IPCTypes.CREATE_SAFE_BOX_RESPONSE,
        data: {
          message: 'ok',
        },
      };
    } catch (error: any) {
      return {
        response: IPCTypes.CREATE_SAFE_BOX_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
