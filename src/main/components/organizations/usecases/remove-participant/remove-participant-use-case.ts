import { store } from '@/main/main';
import { IToken } from '@/main/types';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { IRemoveParticipantRequestDTO } from './remove-participant-request-dto';
import { OrganizationModelAPI } from '../../model/Organization';
import { refreshOrganizations } from '../../electronstore/store';
import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';

export class RemoveParticipantUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase,
    private organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase
  ) {}

  async execute(data: IRemoveParticipantRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

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

    if (response.status !== 200 || response.data.status !== 'ok') {
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error API remove organization participant, ${JSON.stringify(
          response
        )}`
      );
    }
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

    if (updateDatabase instanceof Error) {
      throw new Error(
        ` ${
          (store.get('user') as any)?.email
        }: Error update organization in Remove Participant Use Case: ${updateDatabase}`
      );
    }

    await refreshOrganizations(
      this.organizationRepositoryDatabase,
      this.organizationIconRepositoryDatabase
    );

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
}
