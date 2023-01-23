import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { UpdateOrganizationController } from './update-organization-controller';
import { UpdateOrganizationUseCase } from './update-organization-use-case';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();
const organizationRepositoryDatabase = new OrganizationRepositoryDatabase();
const organizationIconRepositoryDatabase =
  new OrganizationIconRepositoryDatabase();

const updateOrganizationUseCase = new UpdateOrganizationUseCase(
  organizationRepositoryAPI,
  organizationRepositoryDatabase,
  organizationIconRepositoryDatabase
);

const updateOrganizationController = new UpdateOrganizationController(
  updateOrganizationUseCase
);

export { updateOrganizationController };
