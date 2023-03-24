import { store } from '@/main/main';
import { IPCError } from '@/main/utils/IPCError';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { InviteParticipantRequestDTO } from './invite-participant-request-dto';
import { OrganizationModelAPI } from '../../model/Organization';
import { refreshOrganizations } from '../../electronstore/store';
import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';

export class InviteParticipantUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase,
    private organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase
  ) {}

  async execute(data: InviteParticipantRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    let response;

    if (data.type === 'guestAdmin') {
      response = await this.organizationRepositoryAPI.inviteAdmin({
        ...data,
        authorization,
      });
    } else {
      response = await this.organizationRepositoryAPI.inviteParticipant({
        ...data,
        authorization,
      });
    }

    IPCError({
      object: response,
      type: 'api',
      message: 'ERROR API INVITE NEW USER ORGANIZATION',
    });

    const organizationUpdated = response.data.detail[0] as OrganizationModelAPI;

    const updateDatabase = await this.organizationRepositoryDatabase.update({
      ...organizationUpdated,
      _id: organizationUpdated._id.$oid,
      data_atualizacao: organizationUpdated.data_atualizacao.$date,
      convidados_administradores: JSON.stringify(
        organizationUpdated.convidados_administradores
      ),
      convidados_participantes: JSON.stringify(
        organizationUpdated.convidados_participantes
      ),
      participantes: JSON.stringify(organizationUpdated.participantes),
      administradores: JSON.stringify(organizationUpdated.administradores),
    });

    IPCError({
      object: updateDatabase,
      type: 'database',
      message: 'ERROR DATABASE UPDATE ORGANIZATION',
    });

    await refreshOrganizations(
      this.organizationRepositoryDatabase,
      this.organizationIconRepositoryDatabase
    );

    return {
      message: 'ok',
      data: { organizationId: organizationUpdated._id.$oid },
    };
  }
}
