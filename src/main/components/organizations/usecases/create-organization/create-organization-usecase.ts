import { OrganizationIconRepositoryDatabase } from '../../../organizations-icons/repositories/organization-icon-repository-database';
import { ICreateOrganization } from '../../../../ipc/organizations/types';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';

export class CreateOrganizationUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase,
    private organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase
  ) {}

  async execute(organization: ICreateOrganization) {
    const apiCreate = await this.organizationRepositoryAPI.create(organization);

    if (apiCreate.status === 200 && apiCreate.data.msg === 'ok') {
      await this.organizationRepositoryDatabase.create(
        apiCreate.data.detail[0]
      );

      await this.organizationIconRepositoryDatabase.create({
        organizationId: apiCreate.data.detail[0]._id.$oid,
        icon: organization.icon,
      });

      return { message: 'ok' };
    }

    throw new Error('Erro create organization -> API ERROR');
  }
}
