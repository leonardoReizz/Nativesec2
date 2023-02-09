import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { IRefreshSafeBoxesRequestDTO } from './refresh-safe-boxes-request-dto';
import { RefreshSafeBoxesUseCase } from './refresh-safe-boxes-use-case';

export class RefreshSafeBoxesController {
  constructor(private refreshSafeBoxesUseCase: RefreshSafeBoxesUseCase) {}

  async handle(data: IRefreshSafeBoxesRequestDTO) {
    console.log(data, 'refresh');
    try {
      const message = await this.refreshSafeBoxesUseCase.execute(data);

      return {
        response: IPCTypes.REFRESH_SAFE_BOXES_RESPONSE,
        data: message,
      };
    } catch (error) {
      return {
        response: IPCTypes.REFRESH_SAFE_BOXES_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
