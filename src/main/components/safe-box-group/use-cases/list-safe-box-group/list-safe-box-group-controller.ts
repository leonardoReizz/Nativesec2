import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { IListSafeBoxRequestDTO } from '@/main/components/safe-box/usecases/list-safe-box/IListSafeBoxRequestDTO';
import { ListSafeBoxGroupUseCase } from './list-safe-box-group-use-case';
import '@sentry/tracing';

export class ListSafeBoxGroupController {
  constructor(private listSafeBoxGroupUseCase: ListSafeBoxGroupUseCase) {}

  async handle(data: IListSafeBoxRequestDTO) {
    try {
      const message = this.listSafeBoxGroupUseCase.execute(data);

      return {
        response: IPCTypes.LIST_SAFE_BOX_GROUP_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.LIST_SAFE_BOX_GROUP_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
