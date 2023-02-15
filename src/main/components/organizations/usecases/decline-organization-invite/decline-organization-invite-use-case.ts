import { store } from '@/main/main';
import { IToken } from '@/main/types';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { IInvite } from '../list-organizations-invites/types';
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
      const filterNotifications = (
        store.get('organizationInvites') as IInvite[]
      ).filter((notification) => notification._id.$oid !== data.organizationId);

      store.set('organizationInvites', filterNotifications);

      return { message: 'ok' };
    }

    throw new Error(`ERROR API DECLINE ORGANIZATION INVITE ${decline}`);
  }
}
