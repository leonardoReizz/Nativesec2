import { store } from '@/main/main';
import { IToken } from '@/main/types';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { IDeclineOrganizationInviteRequestDTO } from './decline-organization-invite-request-DTO';

export class DeclineOrganizationInviteUseCase {
  constructor(private organizationRepositoryAPI: OrganizationRepositoryAPI) {}

  async execute(data: IDeclineOrganizationInviteRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const decline = await this.organizationRepositoryAPI.declineInvite({
      ...data,
      authorization,
    });

    if (decline.status === 200 && decline.data.status === 'ok') {
      return { message: 'ok' };
    }

    throw new Error(`ERROR API DECLINE ORGANIZATION INVITE ${decline}`);
  }
}
