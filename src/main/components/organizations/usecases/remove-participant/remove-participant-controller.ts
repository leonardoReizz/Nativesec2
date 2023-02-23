import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { IRemoveParticipantRequestDTO } from './remove-participant-request-dto';
import { RemoveParticipantUseCase } from './remove-participant-use-case';
import '@sentry/tracing';

export class RemoveParticipantController {
  constructor(private removeParticipantUseCase: RemoveParticipantUseCase) {}

  async handle(data: IRemoveParticipantRequestDTO) {
    try {
      const response = await this.removeParticipantUseCase.execute(data);

      if (data.changeUser) {
        return {
          response: IPCTypes.REMOVE_PARTICIPANT_ORGANIZATION_RESPONSE,
          data: response,
        };
      }
      return {
        response: IPCTypes.REMOVE_PARTICIPANT_ORGANIZATION_RESPONSE,
        data: response,
      };
    } catch (error) {
      const messageError = (error as Error).message;
      Sentry.captureException(error);
      return {
        response: IPCTypes.REMOVE_PARTICIPANT_ORGANIZATION_RESPONSE,
        data: {
          message: messageError,
        },
      };
    }
  }
}
