import { IPCTypes } from 'renderer/@types/IPCTypes';
import { InviteParticipantRequestDTO } from './invite-participant-request-dto';
import { InviteParticipantUseCase } from './invite-participant-use-case';

export class InviteParticipantController {
  constructor(private addNewParticipantUseCase: InviteParticipantUseCase) {}

  async handle(data: InviteParticipantRequestDTO) {
    try {
      await this.addNewParticipantUseCase.execute(data);
      return {
        response: IPCTypes.ADD_NEW_PARTICIPANT_ORGANIZATION_RESPONSE,
        data: {
          message: 'ok',
        },
      };
    } catch (error) {
      return {
        response: IPCTypes.ADD_NEW_PARTICIPANT_ORGANIZATION_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
