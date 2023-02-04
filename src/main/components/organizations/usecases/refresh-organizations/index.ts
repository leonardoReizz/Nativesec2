import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { RefreshOrganizationsController } from './refresh-organizations-controller';
import { RefreshOrganizationsUseCase } from './refresh-organizations-use-case';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();
const organizationIconRepositoryDatabase =
  new OrganizationIconRepositoryDatabase();
const organizationRepositoryDatabase = new OrganizationRepositoryDatabase();

const refreshOrganizationUseCase = new RefreshOrganizationsUseCase(
  organizationRepositoryAPI,
  organizationIconRepositoryDatabase,
  organizationRepositoryDatabase
);

const refreshOrganizationController = new RefreshOrganizationsController(
  refreshOrganizationUseCase
);

export { refreshOrganizationController };
