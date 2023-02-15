import { store } from '@/main/main';
import { IToken } from '@/main/types';
import { refreshOrganizations } from '../../electronstore/store';
import { OrganizationModelAPI } from '../../model/Organization';
import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { IInvite } from '../list-organizations-invites/types';
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
      const organization = accept.data.detail[0] as OrganizationModelAPI;
      await this.organizationRepositoryDatabase.create({
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
        data_criacao: organization.data_criacao.$date,
      });

      const organizationIcon = await this.organizationRepositoryAPI.getIcon(
        organization._id.$oid,
        authorization
      );

      if (
        organizationIcon.status !== 200 ||
        organizationIcon.data.status !== 'ok'
      ) {
        throw new Error(
          `ERROR API GET ORGANIZATION ICON ${JSON.stringify(organizationIcon)}`
        );
      }

      await this.organizationIconRepositoryDatabase.create({
        organizationId: organization._id.$oid,
        icon: organizationIcon.data.msg[0].icone,
      });

      await refreshOrganizations(
        this.organizationRepositoryDatabase,
        this.organizationIconRepositoryDatabase
      );

      const filterNotifications = (
        store.get('organizationInvites') as IInvite[]
      ).filter((notification) => notification._id.$oid !== data.organizationId);

      store.set('organizationInvites', filterNotifications);

      return { message: 'ok', data: { organizationId: data.organizationId } };
    }

    throw new Error(
      `ERROR API ACCEPT ORGANIZATION INVITE: ${JSON.stringify(accept)}`
    );
  }
}
