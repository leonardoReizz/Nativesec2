import { OrganizationIconRepositoryAPI } from '../../repositories/organization-icon-repository-api';
import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-repository-database';
import { ICreateOrganizationIconRequestDTO } from './create-organziation-icon-dto';

export class CreateOrganizationIconUseCase {
  constructor(
    private organizationIconRepositoryAPI: OrganizationIconRepositoryAPI,
    private organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase
  ) {}

  async execute(data: ICreateOrganizationIconRequestDTO) {
    return { created: true };
  }
}
