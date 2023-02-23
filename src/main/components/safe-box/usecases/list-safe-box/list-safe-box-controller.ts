import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { IListSafeBoxRequestDTO } from './IListSafeBoxRequestDTO';
import { ListSafeBoxUseCase } from './list-safe-box-use-case';
import '@sentry/tracing';

export class ListSafeBoxController {
  constructor(private listSafeBoxUseCase: ListSafeBoxUseCase) {}

  async handle(data: IListSafeBoxRequestDTO) {
    try {
      const message = await this.listSafeBoxUseCase.execute(data);
      return {
        response: IPCTypes.LIST_SAFE_BOXES_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.LIST_SAFE_BOXES_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
