import { IToken } from '../../../../types';
import { store } from '../../../../main';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { InviteParticipantRequestDTO } from './invite-participant-request-dto';
import { OrganizationModelAPI } from '../../model/Organization';
import { refreshOrganizations } from '../../electronstore/store';

export class InviteParticipantUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase
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

    if (response.status === 200 && response.data.status === 'ok') {
      const organizationUpdated = response.data
        .detail[0] as OrganizationModelAPI;

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

      if (updateDatabase instanceof Error) {
        throw new Error(
          `Error update organization in Invite Participant Use Case: ${updateDatabase}`
        );
      }
      await refreshOrganizations();
      return {
        message: 'ok',
        data: { organizationId: organizationUpdated._id.$oid },
      };
    }
    throw new Error(
      `Error Invite Participant ${data.type} in API: ${response}`
    );
  }
}
