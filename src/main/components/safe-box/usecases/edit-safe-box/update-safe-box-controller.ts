import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { IUpdateSafeBoxRequestDTO } from './update-safe-box-request-dto';
import { UpdateSafeBoxUseCase } from './update-safe-box-use-case';

export class UpdateSafeBoxController {
  constructor(private updateSafeBoxUseCase: UpdateSafeBoxUseCase) {}

  async handle(data: IUpdateSafeBoxRequestDTO) {
    try {
      await this.updateSafeBoxUseCase.execute(data);

      return {
        response: IPCTypes.UPDATE_SAFE_BOX_RESPONSE,
        data: {
          message: 'ok',
        },
      };
    } catch (error) {
      return {
        response: IPCTypes.UPDATE_SAFE_BOX_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
