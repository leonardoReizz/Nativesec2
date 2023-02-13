import { store } from '@/main/main';
import { IToken } from '@/main/types';
import { refreshOrganizations } from '../../electronstore/store';
import { OrganizationModelAPI } from '../../model/Organization';
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

    if (listAPI.status === 200 && listAPI.data.status === 'ok') {
      const apiOrganizations: OrganizationModelAPI[] = listAPI.data.msg;

      const organizationInfo: OrganizationModelAPI[] = await Promise.all(
        apiOrganizations.map(async (org: OrganizationModelAPI) => {
          const APIGetOrganization =
            await this.organizationRepositoryAPI.getOrganization(
              org._id.$oid,
              authorization
            );

          return APIGetOrganization?.data?.msg[0];
        })
      );

      if (organizationInfo.length > 0) {
        const APIListOrganizationIcons =
          await this.organizationRepositoryAPI.listIcons(authorization);
        if (
          APIListOrganizationIcons.status === 200 &&
          APIListOrganizationIcons.data.status === 'ok'
        ) {
          organizationsResponse = true;
          organizationsResponse = await organizationComparator({
            organizations: organizationInfo,
            organizationRepositoryDatabase: this.organizationRepositoryDatabase,
            icons: APIListOrganizationIcons.data.msg,
            organizationIconRepositoryDatabase:
              this.organizationIconRepositoryDatabase,
          });

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
        throw new Error('Erro API List Icons');
      }

      throw new Error('ERRO API GET ORGANIZATIONS ICONS');
    }

    throw new Error('ERRO API GET ORGANIZATIONS');
  }
}
