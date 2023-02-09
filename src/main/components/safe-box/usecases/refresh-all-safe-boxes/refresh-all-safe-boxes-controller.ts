import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { RefreshAllSafeBoxesUseCase } from './refresh-all-safe-boxes-use-case';

export class RefreshAllSafeBoxesController {
  constructor(private refreshAllSafeBoxesUseCase: RefreshAllSafeBoxesUseCase) {}

  async handle() {
    try {
      const message = await this.refreshAllSafeBoxesUseCase.execute();
      return {
        response: IPCTypes.REFRESH_ALL_SAFE_BOXES_RESPONSE,
        data: message,
      };
    } catch (error) {
      return {
        response: IPCTypes.REFRESH_ALL_SAFE_BOXES_RESPONSE,
        data: {
          message: 'ok',
        },
      };
    }
  }
}
