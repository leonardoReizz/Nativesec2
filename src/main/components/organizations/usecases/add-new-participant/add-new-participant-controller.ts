import { IPCTypes } from 'renderer/@types/IPCTypes';
import { AddNewParticipantRequestDTO } from './add-new-participant-request-dto';
import { AddNewParticipantUseCase } from './add-new-participant-use-case';

class AddNewParticipantController {
  constructor(private addNewParticipantUseCase: AddNewParticipantUseCase) {}

  async handle(data: AddNewParticipantRequestDTO) {
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
