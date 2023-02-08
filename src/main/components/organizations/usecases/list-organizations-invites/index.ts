import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { ListOrganizationsInvitesController } from './list-organizations-invites-controller';
import { ListOrganizationsInvitesUseCase } from './list-organizations-invites-use-case';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();

const listOrganizationsInvitesUseCase = new ListOrganizationsInvitesUseCase(
  organizationRepositoryAPI
);

const listOrganizationsInvitesController =
  new ListOrganizationsInvitesController(listOrganizationsInvitesUseCase);

export { listOrganizationsInvitesController };
