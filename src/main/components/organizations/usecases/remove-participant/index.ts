import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { RemoveParticipantController } from './remove-participant-controller';
import { RemoveParticipantUseCase } from './remove-participant-use-case';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();
const organizationRepositoryDatabase = new OrganizationRepositoryDatabase();
const organizationIconRepositoryDatabase =
  new OrganizationIconRepositoryDatabase();

const removeParticipantUseCase = new RemoveParticipantUseCase(
  organizationRepositoryAPI,
  organizationRepositoryDatabase,
  organizationIconRepositoryDatabase
);

const removeParticipantController = new RemoveParticipantController(
  removeParticipantUseCase
);

export { removeParticipantController };
