import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { RemoveInviteParticipantController } from './remove-invite-participante-controller';
import { RemoveInviteParticipantUseCase } from './remove-invite-participante-use-case';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();

const removeInviteParticipantUseCase = new RemoveInviteParticipantUseCase(
  organizationRepositoryAPI
);
const removeInviteParticipantController = new RemoveInviteParticipantController(
  removeInviteParticipantUseCase
);

export { removeInviteParticipantController };
