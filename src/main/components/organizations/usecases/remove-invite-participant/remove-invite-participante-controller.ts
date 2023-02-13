import { IPCTypes } from '@/types/IPCTypes';
import { IRemoveInviteParticipantRequestDTO } from './remove-invite-participant-request-dto';
import { RemoveInviteParticipantUseCase } from './remove-invite-participante-use-case';

export class RemoveInviteParticipantController {
  constructor(
    private removeInviteParticipantUseCase: RemoveInviteParticipantUseCase
  ) {}

  async handle(data: IRemoveInviteParticipantRequestDTO) {
    try {
      const response = await this.removeInviteParticipantUseCase.execute(data);
      if (data.changeUser) {
        return {
          response: IPCTypes.REMOVE_INVITE_PARTICIPANT_RESPONSE,
          data: response,
        };
      }
      return {
        response: IPCTypes.REMOVE_INVITE_PARTICIPANT_RESPONSE,
        data: response,
      };
    } catch (error) {
      const errorMessage = (error as Error).message;

      return {
        response: IPCTypes.REMOVE_INVITE_PARTICIPANT_RESPONSE,
        message: errorMessage,
      };
    }
  }
}
