import { IPCTypes } from '@/types/IPCTypes';
import { ForceRefreshSafeBoxesUseCase } from './force-refresh-safe-boxes-use-case';
import { IForceRefreshSafeBoxesRequestDTO } from './IForceRefreshSafeBoxesRequestDTO';

export class ForceRefreshSafeBoxesController {
  constructor(
    private forceRefreshSafeBoxesUseCase: ForceRefreshSafeBoxesUseCase
  ) {}

  async handle(data: IForceRefreshSafeBoxesRequestDTO) {
    try {
      const message = await this.forceRefreshSafeBoxesUseCase.execute(data);
      return {
        response: IPCTypes.FORCE_REFRESH_SAFE_BOXES_RESPONSE,
        data: message,
      };
    } catch (error) {
      return {
        response: IPCTypes.FORCE_REFRESH_SAFE_BOXES_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
