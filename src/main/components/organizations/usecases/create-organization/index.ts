import { OrganizationIconRepositoryAPI } from 'main/components/organizations-icons/repositories/organization-icon-repository-api';
import { OrganizationIconRepositoryDatabase } from 'main/components/organizations-icons/repositories/organization-icon-repository-database';
import { CreateOrganizationIconUseCase } from 'main/components/organizations-icons/usecases/create-organization-icon/create-organization-icon-usecase';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { CreateOrganizationController } from './create-organization-controller';
import { CreateOrganizationUseCase } from './create-organization-usecase';

const organizationRepositoryAPI = new OrganizationRepositoryAPI();
const organizationRepositoryDatabase = new OrganizationRepositoryDatabase();

const organizationIconRepositoryAPI = new OrganizationIconRepositoryAPI();
const organizationIconRepositorydatabase =
  new OrganizationIconRepositoryDatabase();

const createOrganizationUseCase = new CreateOrganizationUseCase(
  organizationRepositoryAPI,
  organizationRepositoryDatabase
);

const createOrganizationIconUseCase = new CreateOrganizationIconUseCase(
  organizationIconRepositoryAPI,
  organizationIconRepositorydatabase
);

const createOrganizationController = new CreateOrganizationController(
  createOrganizationUseCase,
  createOrganizationIconUseCase
);

export { createOrganizationController };
