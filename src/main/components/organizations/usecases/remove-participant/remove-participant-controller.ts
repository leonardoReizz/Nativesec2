import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { IRemoveParticipantRequestDTO } from './remove-participant-request-dto';
import { RemoveParticipantUseCase } from './remove-participant-use-case';

export class RemoveParticipantController {
  constructor(private removeParticipantUseCase: RemoveParticipantUseCase) {}

  async handle(data: IRemoveParticipantRequestDTO) {
    try {
      const message = await this.removeParticipantUseCase.execute(data);

      return {
        response: IPCTypes.REMOVE_PARTICIPANT_RESPONSE,
        data: {
          message,
        },
      };
    } catch (error) {
      const messageError = (error as Error).message;
      return {
        response: IPCTypes.REMOVE_PARTICIPANT_RESPONSE,
        data: {
          message: messageError,
        },
      };
    }
  }
}
