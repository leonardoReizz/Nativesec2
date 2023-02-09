import { store } from '../../../../main';
import { IToken } from '../../../../types';
import { IInvite } from './types';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';

export class ListOrganizationsInvitesUseCase {
  constructor(private organizationRepositoryAPI: OrganizationRepositoryAPI) {}

  async execute() {
    const { tokenType, accessToken } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const listInvites = await this.organizationRepositoryAPI.listMyInvites(
      authorization
    );

    if (listInvites.status === 200 && listInvites.data.status === 'ok') {
      const invites = listInvites.data.msg as IInvite[];
      store.set('organizationInvites', invites);
      return { message: 'ok' };
    }

    throw new Error('ERROR API LIST MY INVITES');
  }
}
