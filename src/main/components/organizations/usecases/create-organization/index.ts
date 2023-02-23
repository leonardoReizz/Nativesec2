import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { CreateOrganizationController } from './create-organization-controller';
import { CreateOrganizationUseCase } from './create-organization-usecase';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();
const organizationRepositoryDatabase = new OrganizationRepositoryDatabase();
const organizationIconRepositoryDatabase =
  new OrganizationIconRepositoryDatabase();

const createOrganizationUseCase = new CreateOrganizationUseCase(
  organizationRepositoryAPI,
  organizationRepositoryDatabase,
  organizationIconRepositoryDatabase
);

const createOrganizationController = new CreateOrganizationController(
  createOrganizationUseCase
);

export { createOrganizationController };
