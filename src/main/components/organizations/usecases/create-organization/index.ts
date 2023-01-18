import { OrganizationIconRepositoryAPI } from '../../../organizations-icons/repositories/organization-icon-repository-api';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { CreateOrganizationController } from './create-organization-controller';
import { CreateOrganizationUseCase } from './create-organization-usecase';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();
const organizationRepositoryDatabase = new OrganizationRepositoryDatabase();
const organizationIconRepositoryAPI = new OrganizationIconRepositoryAPI();

const createOrganizationUseCase = new CreateOrganizationUseCase(
  organizationRepositoryAPI,
  organizationRepositoryDatabase,
  organizationIconRepositoryAPI
);

const createOrganizationController = new CreateOrganizationController(
  createOrganizationUseCase
);

export { createOrganizationController };
