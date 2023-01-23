import { ICreateOrganization } from '../../../../ipc/organizations/types';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { refreshOrganizations } from '../../electronstore/store';
import { OrganizationModelAPI } from '../../model/Organization';
import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';

export class CreateOrganizationUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase,
    private organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase
  ) {}

  async execute(organization: ICreateOrganization) {
    const apiCreate = await this.organizationRepositoryAPI.create(organization);

    console.log(apiCreate.status, apiCreate.data.msg, apiCreate.data.detail);
    if (apiCreate.status === 200 && apiCreate.data.msg === 'org created') {
      const organizationCreated = <OrganizationModelAPI>(
        apiCreate.data.detail[0]
      );

      const organizationCreatedModelDatabase = {
        ...organizationCreated,
        _id: organizationCreated._id.$oid,
        convidados_administradores: JSON.stringify(
          organizationCreated.convidados_administradores
        ),
        convidados_participantes: JSON.stringify(
          organizationCreated.convidados_participantes
        ),
        participantes: JSON.stringify(organizationCreated.participantes),
        administradores: JSON.stringify(organizationCreated.administradores),
        data_criacao: organizationCreated.data_criacao.$date,
        data_atualizacao: organizationCreated.data_atualizacao.$date,
      };

      await this.organizationRepositoryDatabase.create(
        organizationCreatedModelDatabase
      );

      await this.organizationIconRepositoryDatabase.create({
        organizationId: organizationCreatedModelDatabase._id,
        icon: organization.icon,
      });

      await refreshOrganizations();
      return {
        message: 'ok',
        organization: organizationCreatedModelDatabase,
      };
    }

    throw new Error('Error create organization -> API ERROR');
  }
}
