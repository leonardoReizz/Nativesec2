import { store } from '@/main/main';
import { IToken } from '@/main/types';
import { refreshOrganizations } from '../../electronstore/store';
import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { ILeaveOrganizationRequestDTO } from './leave-organization-request-dto';

export class LeaveOrganizationUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase,
    private organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase
  ) {}

  async execute(data: ILeaveOrganizationRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const leave = await this.organizationRepositoryAPI.leave({
      organizationId: data.organizationId,
      authorization,
    });

    if (leave.status === 200 && leave.data.status === 'ok') {
      this.organizationRepositoryDatabase.delete(data.organizationId);
      this.organizationIconRepositoryDatabase.delete(data.organizationId);

      await refreshOrganizations(
        this.organizationRepositoryDatabase,
        this.organizationIconRepositoryDatabase
      );

      return { message: 'ok' };
    }

    throw new Error(`ERROR API USER LEAVE ORGANIZATION ${leave}`);
  }
}
