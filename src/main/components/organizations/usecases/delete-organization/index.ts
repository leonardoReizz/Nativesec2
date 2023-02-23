import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { DeleteOrganizationController } from './delete-organization-controller';
import { DeleteOrganizationUseCase } from './delete-organization-use-case';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();
const organizationRepositoryDatabase = new OrganizationRepositoryDatabase();
const organizationIconRepositoryDatabase =
  new OrganizationIconRepositoryDatabase();

const deleteOrganizationUseCase = new DeleteOrganizationUseCase(
  organizationRepositoryAPI,
  organizationRepositoryDatabase,
  organizationIconRepositoryDatabase
);

const deleteOrganizationController = new DeleteOrganizationController(
  deleteOrganizationUseCase
);

export { deleteOrganizationController };
