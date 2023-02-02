import { IToken } from '../../../../types';
import { store } from '../../../../main';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { IRemoveParticipantRequestDTO } from './remove-participant-request-dto';
import { OrganizationModelAPI } from '../../model/Organization';
import { refreshOrganizations } from '../../electronstore/store';

export class RemoveParticipantUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase
  ) {}

  async execute(data: IRemoveParticipantRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    console.log(data, 'remove participant');
    let response;

    if (data.type === 'admin') {
      response = await this.organizationRepositoryAPI.removeAdmin({
        ...data,
        authorization,
      });
    } else {
      response = await this.organizationRepositoryAPI.removeParticipant({
        ...data,
        authorization,
      });
    }

    console.log(response, ' remove participant');
    console.log(response.data.detail[0], 'remove participant');

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

      console.log(updateDatabase);
      if (updateDatabase instanceof Error) {
        throw new Error(
          `Error update organization in Remove Participant Use Case: ${updateDatabase}`
        );
      }
      await refreshOrganizations();
      return {
        message: 'ok',
        data: {
          organizationId: organizationUpdated._id.$oid,
          changeUser: data.changeUser,
          email: data.email,
          type: data.type,
        },
      };
    }
    throw new Error(
      `Error Remove Participant ${data.type} in API: ${response}`
    );
  }
}
