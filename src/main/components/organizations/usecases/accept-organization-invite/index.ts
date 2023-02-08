import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { AcceptOrganizationInviteController } from './accept-organization-invite-controller';
import { AcceptOrganizationInviteUseCase } from './accept-organization-invite-use-case';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();
const organizationRepositoryDatabase = new OrganizationRepositoryDatabase();
const organizationIconRepositoryDatabase =
  new OrganizationIconRepositoryDatabase();

const acceptOrganizationInviteUseCase = new AcceptOrganizationInviteUseCase(
  organizationRepositoryAPI,
  organizationRepositoryDatabase,
  organizationIconRepositoryDatabase
);

const acceptOrganizationInviteController =
  new AcceptOrganizationInviteController(acceptOrganizationInviteUseCase);

export { acceptOrganizationInviteController };
