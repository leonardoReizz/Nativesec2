import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { DeclineOrganizationInviteController } from './decline-organization-invite-controller';
import { DeclineOrganizationInviteUseCase } from './decline-organization-invite-use-case';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();

const declineOrganizationInviteUseCase = new DeclineOrganizationInviteUseCase(
  organizationRepositoryAPI
);

const declineOrganizationInviteController =
  new DeclineOrganizationInviteController(declineOrganizationInviteUseCase);

export { declineOrganizationInviteController };
