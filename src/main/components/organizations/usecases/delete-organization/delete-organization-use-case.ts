import { store } from '@/main/main';
import { refreshOrganizations } from '../../electronstore/store';
import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';

export class DeleteOrganizationUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase,
    private organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase
  ) {}

  async execute(organizationId: string) {
    const apiDelete = await this.organizationRepositoryAPI.delete(
      organizationId
    );

    if (apiDelete.status !== 200 || apiDelete.data.status !== 'ok') {
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error API delete organization, ${JSON.stringify(apiDelete)}`
      );
    }
    await this.organizationRepositoryDatabase.delete(organizationId);

    await this.organizationIconRepositoryDatabase.delete(organizationId);

    await refreshOrganizations(
      this.organizationRepositoryDatabase,
      this.organizationIconRepositoryDatabase
    );

    return { message: 'ok' };
  }
}
