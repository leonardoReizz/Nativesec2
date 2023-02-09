import { IToken } from '../../../../types';
import { store } from '../../../../main';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { IRemoveInviteParticipantRequestDTO } from './remove-invite-participant-request-dto';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { OrganizationModelAPI } from '../../model/Organization';
import { refreshOrganizations } from '../../electronstore/store';

export class RemoveInviteParticipantUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase
  ) {}

  async execute(data: IRemoveInviteParticipantRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    let response;

    if (data.type === 'guestAdmin') {
      response = await this.organizationRepositoryAPI.removeInviteAdmin({
        ...data,
        authorization,
      });
    } else {
      response = await this.organizationRepositoryAPI.removeInviteParticipant({
        ...data,
        authorization,
      });
    }

    if (response.status === 200 && response.data.status === 'ok') {
      const organizationUpdated = response.data
        .detail[0] as OrganizationModelAPI;

      await this.organizationRepositoryDatabase.update({
        ...organizationUpdated,
        _id: organizationUpdated._id.$oid,
        convidados_administradores: JSON.stringify(
          organizationUpdated.convidados_administradores
        ),
        convidados_participantes: JSON.stringify(
          organizationUpdated.convidados_participantes
        ),
        administradores: JSON.stringify(organizationUpdated.administradores),
        data_atualizacao: organizationUpdated.data_atualizacao.$date,
        participantes: JSON.stringify(organizationUpdated.participantes),
      });

      await refreshOrganizations();

      return {
        message: 'ok',
        data: {
          organizationId: data.organizationId,
          email: data.email,
          type: data.type,
          changeUser: data.changeUser,
        },
      };
    }

    throw new Error(`Error api delete invite ${data.type} ${response}`);
  }
}
