import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { InviteParticipantController } from './invite-participant-controller';
import { InviteParticipantUseCase } from './invite-participant-use-case';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();
const organizationRepositoryDatabase = new OrganizationRepositoryDatabase();
const organizationIconRepositoryDatabase =
  new OrganizationIconRepositoryDatabase();

const inviteParticipantUseCase = new InviteParticipantUseCase(
  organizationRepositoryAPI,
  organizationRepositoryDatabase,
  organizationIconRepositoryDatabase
);
const inviteParticipantController = new InviteParticipantController(
  inviteParticipantUseCase
);

export { inviteParticipantController };
