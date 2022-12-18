import { ICreateOrganization } from 'main/ipc/organizations/types';
import { api } from 'main/util';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';

export class CreateOrganizationUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase
  ) {}

  async execute(organization: ICreateOrganization) {
    const apiCreate = await this.organizationRepositoryAPI.create(organization);

    if (apiCreate.status === 200 && apiCreate.data.msg === 'ok') {
      const databaseCreate = await this.organizationRepositoryDatabase.create(
        apiCreate.data.detail[0]
      );

      if (databaseCreate) {
        return { created: true, organization: apiCreate.data.detail[0] };
      }
    }
    return { created: false };
  }
}
