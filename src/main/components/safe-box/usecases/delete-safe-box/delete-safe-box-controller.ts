import { IPCTypes } from '@/types/IPCTypes';
import { IDeleteSafeBoxRequestDTO } from './delete-safe-box-request-dto';
import { DeleteSafeBoxUseCase } from './delete-safe-box-usecase';

export default class DeleteSafeBoxController {
  constructor(private deleteSafeBoxUseCase: DeleteSafeBoxUseCase) {}

  async handle(data: IDeleteSafeBoxRequestDTO) {
    try {
      const { message } = await this.deleteSafeBoxUseCase.execute(data);
      return {
        response: IPCTypes.DELETE_SAFE_BOX_RESPONSE,
        data: {
          message,
        },
      };
    } catch (error) {
      return {
        response: IPCTypes.DELETE_SAFE_BOX_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
