import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { IRemoveInviteParticipantRequestDTO } from './remove-invite-participant-request-dto';

export class RemoveInviteParticipantUseCase {
  constructor(private organizationRepositoryAPI: OrganizationRepositoryAPI) {}

  async execute(data: IRemoveInviteParticipantRequestDTO) {
    return {
      message: 'ok',
      data: data.organizationId,
    };
  }
}
