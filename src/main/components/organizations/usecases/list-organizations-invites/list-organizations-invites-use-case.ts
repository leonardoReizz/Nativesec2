import { store } from '@/main/main';
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

    if (listInvites.status !== 200 || listInvites.data.status !== 'ok') {
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error API list my invites, ${JSON.stringify(listInvites)}`
      );
    }

    const invites = listInvites.data.msg as IInvite[];
    store.set('organizationInvites', invites);

    return { message: 'ok' };
  }
}
