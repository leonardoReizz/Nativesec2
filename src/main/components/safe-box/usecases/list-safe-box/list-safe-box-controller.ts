import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { IListSafeBoxRequestDTO } from './IListSafeBoxRequestDTO';
import { ListSafeBoxUseCase } from './list-safe-box-use-case';

export class ListSafeBoxController {
  constructor(private listSafeBoxUseCase: ListSafeBoxUseCase) {}

  async handle(data: IListSafeBoxRequestDTO) {
    try {
      const message = await this.listSafeBoxUseCase.execute(data);
      return {
        response: IPCTypes.GET_SAFE_BOXES_RESPONSE,
        data: message,
      };
    } catch (error) {
      return {
        response: IPCTypes.GET_SAFE_BOXES_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
