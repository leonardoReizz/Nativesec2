import { store } from '../../../../main';
import { IToken } from '../../../../types';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { refreshOrganizations } from '../../electronstore/store';
import {
  OrganizationModelAPI,
  OrganizationModelDatabase,
} from '../../model/Organization';
import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { ICreateOrganizationRequestDTO } from './create-organization-request-dto';

export class CreateOrganizationUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase,
    private organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase
  ) {}

  async execute(organization: ICreateOrganizationRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const apiCreate = await this.organizationRepositoryAPI.create(
      organization,
      authorization
    );

    if (apiCreate.status === 200 && apiCreate.data.msg === 'org created') {
      const organizationCreated = <OrganizationModelAPI>(
        apiCreate.data.detail[0]
      );
      await Promise.all(
        organization.participantGuests.map(async (email: string) => {
          await this.organizationRepositoryAPI.inviteParticipant({
            email,
            authorization,
            organizationId: organizationCreated._id.$oid,
          });
        })
      );
      await Promise.all(
        organization.adminGuests.map(async (email: string) => {
          await this.organizationRepositoryAPI.inviteAdmin({
            email,
            authorization,
            organizationId: organizationCreated._id.$oid,
          });
        })
      );

      const getOrganization =
        await this.organizationRepositoryAPI.getOrganization(
          organizationCreated._id.$oid,
          authorization
        );

      if (
        getOrganization.status === 200 &&
        getOrganization.data.status === 'ok'
      ) {
        const updatedOrganization = <OrganizationModelAPI>(
          getOrganization.data.msg[0]
        );

        const organizationCreatedModelDatabase: OrganizationModelDatabase = {
          ...updatedOrganization,
          _id: updatedOrganization._id.$oid,
          convidados_administradores: JSON.stringify(
            updatedOrganization.convidados_administradores
          ),
          convidados_participantes: JSON.stringify(
            updatedOrganization.convidados_participantes
          ),
          participantes: JSON.stringify(updatedOrganization.participantes),
          administradores: JSON.stringify(updatedOrganization.administradores),
          data_criacao: updatedOrganization.data_criacao.$date,
          data_atualizacao: updatedOrganization.data_atualizacao.$date,
        };

        await this.organizationRepositoryDatabase.create(
          organizationCreatedModelDatabase
        );

        await this.organizationIconRepositoryDatabase.create({
          organizationId: organizationCreatedModelDatabase._id,
          icon: organization.icon,
        });

        await refreshOrganizations(
          this.organizationRepositoryDatabase,
          this.organizationIconRepositoryDatabase
        );

        return {
          message: 'ok',
          organization: organizationCreatedModelDatabase,
        };
      }
      throw new Error('Error create organization -> GET ORGANIZATION');
    }

    throw new Error('Error API create organization -> CREATE ');
  }
}
