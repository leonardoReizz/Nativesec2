import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { RemoveInviteParticipantController } from './remove-invite-participante-controller';
import { RemoveInviteParticipantUseCase } from './remove-invite-participante-use-case';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();
const organizationRepositoryDatabase = new OrganizationRepositoryDatabase();

const removeInviteParticipantUseCase = new RemoveInviteParticipantUseCase(
  organizationRepositoryAPI,
  organizationRepositoryDatabase
);
const removeInviteParticipantController = new RemoveInviteParticipantController(
  removeInviteParticipantUseCase
);

export { removeInviteParticipantController };
