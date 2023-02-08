import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { LeaveOrganizationUseCase } from './leave-organization-use-case';
import { LeaveOrganizationController } from './leave-organizaton-controller';

const organizationRepositoryDatabase = new OrganizationRepositoryDatabase();
const organizationIconRepositoryDatabase =
  new OrganizationIconRepositoryDatabase();
const organizationRepositoryAPI = new OrganizationRepositoryAPI();

const leaveOrganizationUseCase = new LeaveOrganizationUseCase(
  organizationRepositoryAPI,
  organizationRepositoryDatabase,
  organizationIconRepositoryDatabase
);

const leaveOrganizationController = new LeaveOrganizationController(
  leaveOrganizationUseCase
);

export { leaveOrganizationController };
