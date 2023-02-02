import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { IRemoveParticipantRequestDTO } from './remove-participant-request-dto';
import { RemoveParticipantUseCase } from './remove-participant-use-case';

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
      return {
        response: IPCTypes.REMOVE_PARTICIPANT_ORGANIZATION_RESPONSE,
        data: {
          message: messageError,
        },
      };
    }
  }
}
