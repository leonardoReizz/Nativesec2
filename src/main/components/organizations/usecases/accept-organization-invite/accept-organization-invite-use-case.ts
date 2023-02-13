import { store } from '@/main/main';
import { IToken } from '@/main/types';
import { refreshOrganizations } from '../../electronstore/store';
import { OrganizationModelAPI } from '../../model/Organization';
import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { IAcceptOrganizationInviteRequestDTO } from './accept-organization-invite-request-dto';

export class AcceptOrganizationInviteUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase,
    private organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase
  ) {}

  async execute(data: IAcceptOrganizationInviteRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const accept = await this.organizationRepositoryAPI.acceptInvite({
      organizationId: data.organizationId,
      authorization,
    });

    if (accept.status === 200 && accept.data.status === 'ok') {
      const organization = accept.data.msg.detail[0] as OrganizationModelAPI;
      await this.organizationRepositoryDatabase.update({
        ...organization,
        _id: organization._id.$oid,
        data_atualizacao: organization.data_atualizacao.$date,
        convidados_administradores: JSON.stringify(
          organization.convidados_administradores
        ),
        convidados_participantes: JSON.stringify(
          organization.convidados_participantes
        ),
        participantes: JSON.stringify(organization.participantes),
        administradores: JSON.stringify(organization.administradores),
      });

      await refreshOrganizations(
        this.organizationRepositoryDatabase,
        this.organizationIconRepositoryDatabase
      );

      return { message: 'ok' };
    }

    throw new Error(`ERROR API ACCEPT ORGANIZATION INVITE: ${accept}`);
  }
}
