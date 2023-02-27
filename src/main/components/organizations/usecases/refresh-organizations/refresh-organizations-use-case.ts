import { store } from '@/main/main';
import { IPCError } from '@/main/utils/IPCError';
import { refreshOrganizations } from '../../electronstore/store';
import {
  OrganizationModelAPI,
  OrganizationModelDatabase,
} from '../../model/Organization';
import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { organizationComparator } from './comparators/organizationComparator';

export class RefreshOrganizationsUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase
  ) {}

  async execute() {
    let organizationsResponse = false;

    const { tokenType, accessToken } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const listAPI = await this.organizationRepositoryAPI.list(authorization);

    IPCError({
      object: listAPI,
      message: 'ERROR API LIST ORGANIZATIONS',
      type: 'api',
    });

    const apiOrganizations: OrganizationModelAPI[] = listAPI.data.msg;

    const organizationInfo: OrganizationModelAPI[] = await Promise.all(
      apiOrganizations.map(async (org: OrganizationModelAPI) => {
        const APIGetOrganization =
          await this.organizationRepositoryAPI.getOrganization(
            org._id.$oid,
            authorization
          );

        IPCError({
          object: APIGetOrganization,
          message: 'ERROR API GET ORGANIZATION INFO',
          type: 'api',
        });

        return APIGetOrganization?.data?.msg[0];
      })
    );

    const APIListOrganizationIcons =
      await this.organizationRepositoryAPI.listIcons(authorization);

    IPCError({
      object: APIListOrganizationIcons,
      message: 'ERROR API GET LIST ORGANIZATION ICONS',
      type: 'api',
    });

    organizationsResponse = true;

    console.log(' organization database list');
    const organizationsDatabase =
      (await this.organizationRepositoryDatabase.list()) as unknown as OrganizationModelDatabase[];

    IPCError({
      object: organizationsDatabase,
      message: 'ERROR DATABASE LIST ORGANIZATIONS',
      type: 'database',
    });

    console.log('comparator');

    organizationsResponse = await organizationComparator({
      organizationsAPI: organizationInfo,
      organizationsDatabase,
      organizationRepositoryDatabase: this.organizationRepositoryDatabase,
      icons: APIListOrganizationIcons.data.msg,
      organizationIconRepositoryDatabase:
        this.organizationIconRepositoryDatabase,
    });

    console.log(' sai comparator');
    await refreshOrganizations(
      this.organizationRepositoryDatabase,
      this.organizationIconRepositoryDatabase
    );

    return {
      message: 'ok',
      data: {
        organizationsResponse,
      },
    };
  }
}
