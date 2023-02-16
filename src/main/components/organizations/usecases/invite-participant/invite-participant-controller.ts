import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { InviteParticipantRequestDTO } from './invite-participant-request-dto';
import { InviteParticipantUseCase } from './invite-participant-use-case';
import '@sentry/tracing';

export class InviteParticipantController {
  constructor(private addNewParticipantUseCase: InviteParticipantUseCase) {}

  async handle(data: InviteParticipantRequestDTO) {
    try {
      const response = await this.addNewParticipantUseCase.execute(data);
      return {
        response: IPCTypes.ADD_NEW_PARTICIPANT_ORGANIZATION_RESPONSE,
        data: response,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.ADD_NEW_PARTICIPANT_ORGANIZATION_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
