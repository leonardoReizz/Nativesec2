import { IToken } from '../../../../types';
import { store } from '../../../../main';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { InviteParticipantRequestDTO } from './invite-participant-request-dto';

export class InviteParticipantUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase
  ) {}

  async execute(data: InviteParticipantRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    let response;
    if (data.type === 'writeAndRead') {
      response = await this.organizationRepositoryAPI.inviteAdmin({
        ...data,
        authorization,
      });
    } else {
      response = await this.organizationRepositoryAPI.inviteAdmin({
        ...data,
        authorization,
      });
    }

    if (response.status === 200 && response.data.status === 'ok') {
      const organizaton = await this.organizationRepositoryDatabase.findById(
        data.organizationId
      );

      if (!(organizaton instanceof Error) && organizaton) {
        const users = JSON.parse(organizaton.convidados_administradores);
        // this.organizationRepositoryDatabase.update()
      }
    }
  }
}
