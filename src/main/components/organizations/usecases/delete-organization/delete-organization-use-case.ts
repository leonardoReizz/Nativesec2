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

    if (apiDelete.status === 200 && apiDelete.data.status === 'ok') {
      await this.organizationRepositoryDatabase.delete(organizationId);

      await this.organizationIconRepositoryDatabase.delete(organizationId);

      await refreshOrganizations(
        this.organizationRepositoryDatabase,
        this.organizationIconRepositoryDatabase
      );

      return { message: 'ok' };
    }

    throw new Error('Error delete organization -> API ERROR');
  }
}
