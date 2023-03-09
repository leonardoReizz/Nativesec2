import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import { ICreateSafeBoxGroupRequestDTO } from './create-safe-box-group-request-dto';
import { CreateSafeBoxGroupUseCase } from './create-safe-box-group-use-case';


export class CreateSafeBoxGroupController {
  constructor(private createSafeBoxGroupUseCase: CreateSafeBoxGroupUseCase) {}

  async handle(data: ICreateSafeBoxGroupRequestDTO) {
    try {
      const message = await this.createSafeBoxGroupUseCase.execute(data);

      return {
        response: IPCTypes.CREATE_SAFE_BOX_GROUP_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.CREATE_SAFE_BOX_GROUP_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
